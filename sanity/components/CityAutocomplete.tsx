// F:\gadocerto-clone\gadocerto-clone\sanity\components\CityAutocomplete.tsx
"use client";

import {useEffect, useMemo, useState} from "react";
import {TextInput, Card, Stack, Box} from "@sanity/ui";
import {
  FormField,
  PatchEvent,
  set,
  unset,
  type StringInputProps,
  type StringSchemaType,
} from "sanity";

/**
 * Objetivo:
 * - Somente grava quando o usuário SELECIONA uma cidade.
 * - Não grava texto livre.
 * - Usa APENAS patches RELATIVOS do campo (set(val) / unset()), que é o formato mais estável do Sanity.
 * - NÃO toca em nenhum outro campo (ex.: 'uf').
 */

type Suggestion = {
  id?: number;
  nome: string;
  microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } };
};

function normalize(s: string) {
  return (s || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
function labelFor(s: Suggestion) {
  const uf = s.microrregiao?.mesorregiao?.UF?.sigla?.toLowerCase();
  return uf ? `${s.nome}/${uf}` : s.nome;
}

export default function CityAutocomplete(
  props: StringInputProps<StringSchemaType>
) {
  const {value, onChange, schemaType, elementProps} = props;

  // valor salvo e o texto digitado
  const [committed, setCommitted] = useState<string>(value ?? "");
  const [query, setQuery] = useState<string>(value ?? "");
  const [all, setAll] = useState<Suggestion[] | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // mantém sincronizado com valor externo
  useEffect(() => {
    setCommitted(value ?? "");
    setQuery(value ?? "");
  }, [value]);

  // carrega cidades pela SUA rota (sem cache do Next Data)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/ibge/municipios", {cache: "no-store"});
        const data: Suggestion[] = await res.json();
        if (!cancelled) setAll(data || []);
      } catch {
        if (!cancelled) setAll([]);
      }
    }
    if (!all) load();
    return () => { cancelled = true; };
  }, [all]);

  // filtra em memória
  const suggestions = useMemo(() => {
    if (!all || !query) return [];
    const q = normalize(query);
    return all
      .filter((c) => normalize(c?.nome || "").includes(q))
      .slice(0, 12);
  }, [all, query]);

  // grava APENAS este campo, com patch relativo (set(val))
  function commitLabel(label: string) {
    if (!label) {
      onChange(PatchEvent.from(unset())); // relativo ao próprio campo
      setCommitted("");
      setQuery("");
      setOpen(false);
      setError(null);
      return;
    }
    onChange(PatchEvent.from(set(label))); // relativo ao próprio campo
    setCommitted(label);
    setQuery(label);
    setOpen(false);
    setError(null);
  }

  // sair do campo sem selecionar → reverte para último válido
  function handleBlur() {
    if (normalize(query) === normalize(committed)) {
      setOpen(false);
      setError(null);
      return;
    }
    const match = suggestions.find((s) => normalize(labelFor(s)) === normalize(query));
    if (match) {
      commitLabel(labelFor(match));
    } else {
      setQuery(committed);
      setOpen(false);
      if (query) setError("Selecione uma cidade da lista — texto livre não é aceito.");
    }
  }

  return (
    <FormField title={schemaType.title || "Cidade"}>
      <Stack space={1}>
        <TextInput
          {...(elementProps || {})}
          value={query}
          onChange={(e) => {
            const v = e.currentTarget.value ?? "";
            setQuery(v);
            setOpen(!!v && !!all && v.length >= 2);
            setError(null);
          }}
          onFocus={() => setOpen(!!query && !!all && query.length >= 2)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, Math.max(0, (suggestions.length || 1) - 1)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              const s = suggestions[active];
              if (s) commitLabel(labelFor(s));
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder='Digite para buscar e selecione (ex.: "Cuiab")'
        />

        {error && (
          <Box paddingTop={1} style={{ fontSize: 12, color: "#b91c1c" }}>
            {error}
          </Box>
        )}

        {open && suggestions.length > 0 && (
          <Card padding={0} radius={2} shadow={2} style={{ position: "absolute", zIndex: 10 }}>
            <Box paddingY={1} style={{ maxHeight: 280, overflowY: "auto" }}>
              {suggestions.map((s, i) => {
                const label = labelFor(s);
                const isActive = i === active;
                return (
                  <Card
                    key={`${s.nome}-${i}`}
                    padding={2}
                    tone={isActive ? "primary" : "default"}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault(); // evita perder o foco antes de gravar
                      commitLabel(label);
                    }}
                  >
                    {label}
                  </Card>
                );
              })}
            </Box>
          </Card>
        )}
      </Stack>
    </FormField>
  );
}
