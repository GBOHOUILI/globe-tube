import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiSearch, FiX, FiFilm, FiTv } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── Animations ────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// ─── Constantes ────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Récents",     value: "Latest"  },
  { label: "Populaires",  value: "Hottest" },
  { label: "Pour vous",   value: "ForYou"  },
];

const LANG_OPTIONS = [
  { label: "Toutes les langues", value: "",            flag: "🌐" },
  { label: "Français (VF)",      value: "French dub",  flag: "🇫🇷" },
  { label: "Français (VOSTFR)",  value: "French sub",  flag: "🇫🇷" },
  { label: "Anglais (VO)",       value: "English dub", flag: "🇬🇧" },
  { label: "Espagnol",           value: "Spanish dub", flag: "🇪🇸" },
];

const LANG_BADGE = {
  "French dub":  "VF",
  "French sub":  "VOSTFR",
  "English dub": "VO",
  "Spanish dub": "VOSE",
};

// ─── Styled ────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: ${({ $isDark }) => $isDark ? "#0a0a12" : "#f8fafc"};
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  padding: 32px 24px 60px;
  font-family: 'Inter', system-ui, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 24px;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
  align-items: center;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 11px 38px 11px 42px;
  border-radius: 999px;
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "#d1d5db"};
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "white"};
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  font-size: 0.93rem;
  outline: none;
  &::placeholder { color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#9ca3af"}; }
  &:focus { border-color: #8A2BE2; }
`;

const SearchIconWrap = styled(FiSearch)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  font-size: 1.1rem;
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#9ca3af"};
  cursor: pointer;
`;

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "#d1d5db"};
  background: ${({ $isDark }) => $isDark ? "#1e2535" : "white"};
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
  font-size: 0.88rem;
  cursor: pointer;
  &:focus { border-color: #8A2BE2; }
`;

const ChipGroup = styled.div`display: flex; gap: 8px;`;

const Chip = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid ${({ $active, $isDark }) => $active
    ? "#8A2BE2"
    : $isDark ? "rgba(148,163,184,0.3)" : "#d1d5db"};
  background: ${({ $active, $isDark }) => $active
    ? $isDark ? "rgba(138,43,226,0.25)" : "rgba(138,43,226,0.08)"
    : "transparent"};
  color: ${({ $active, $isDark }) => $active
    ? $isDark ? "#c084fc" : "#8A2BE2"
    : $isDark ? "#94a3b8" : "#4b5563"};
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s;
  &:hover { border-color: #8A2BE2; color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 14px;
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const Card = styled.div`
  background: ${({ $isDark }) => $isDark ? "#161b22" : "white"};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: ${({ $isDark }) => $isDark
    ? "0 8px 32px rgba(0,0,0,0.45)"
    : "0 8px 32px rgba(0,0,0,0.08)"};
  transition: transform 0.25s, box-shadow 0.25s;
  animation: ${fadeIn} 0.3s ease both;
  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ $isDark }) => $isDark
      ? "0 16px 36px rgba(138,43,226,0.35)"
      : "0 16px 36px rgba(138,43,226,0.15)"};
  }
`;

const PosterWrap = styled.div`
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s;
  ${Card}:hover & { transform: scale(1.05); }
`;

const LangBadge = styled.span`
  position: absolute;
  top: 7px;
  left: 7px;
  background: #8A2BE2;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
`;

const Info = styled.div`padding: 10px 12px 12px;`;

const CardTitle = styled.h3`
  margin: 0 0 5px;
  font-size: 0.93rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: ${({ $isDark }) => $isDark ? "#e2e8f0" : "#1e293b"};
`;

const CardMeta = styled.div`
  font-size: 0.8rem;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  display: flex;
  justify-content: space-between;
`;

const ImdbBadge = styled.span`color: #f5c518; font-weight: 600;`;

const SkeletonCard = styled.div`
  background: linear-gradient(90deg,
    ${({ $isDark }) => $isDark ? "#1e2535" : "#e2e8f0"} 25%,
    ${({ $isDark }) => $isDark ? "#2d3748" : "#cbd5e1"} 50%,
    ${({ $isDark }) => $isDark ? "#1e2535" : "#e2e8f0"} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s infinite;
  border-radius: 14px;
  aspect-ratio: 2 / 3;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ $isDark }) => $isDark ? "#c084fc" : "#8A2BE2"};
  margin: 48px 0 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ $isDark }) => $isDark ? "rgba(148,163,184,0.3)" : "rgba(138,43,226,0.18)"};
  }
`;

const StatusMsg = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 1rem;
  line-height: 1.8;
`;

const ErrorBox = styled.div`
  background: ${({ $isDark }) => $isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)"};
  color: #fca5a5;
  border-left: 3px solid #ef4444;
  padding: 12px 18px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
`;

const LoadMsg = styled.div`
  text-align: center;
  padding: 32px;
  color: ${({ $isDark }) => $isDark ? "#94a3b8" : "#64748b"};
  font-size: 0.88rem;
`;

// ─── Debounce ──────────────────────────────────────────────────────────────
function useDebounce(val, delay = 500) {
  const [deb, setDeb] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setDeb(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return deb;
}

// ─── MovieCard ─────────────────────────────────────────────────────────────
function MovieCard({ movie, lang }) {
  const { isDark } = useTheme();
  const badge = LANG_BADGE[lang];
  return (
    <CardLink to={`/stream/${movie.subjectId}`}>
      <Card $isDark={isDark}>
        <PosterWrap>
          <Poster
            src={movie.cover?.url || "https://via.placeholder.com/300x450/111/888?text=?"}
            alt={movie.title}
            onError={e => { e.target.src = "https://via.placeholder.com/300x450/111/888?text=?"; }}
            loading="lazy"
          />
          {badge && <LangBadge>{badge}</LangBadge>}
        </PosterWrap>
        <Info>
          <CardTitle $isDark={isDark}>{movie.title || "Sans titre"}</CardTitle>
          <CardMeta $isDark={isDark}>
            <span>{movie.releaseDate?.slice(0, 4) || "—"}</span>
            {movie.imdbRatingValue
              ? <ImdbBadge>★ {movie.imdbRatingValue}</ImdbBadge>
              : <span>{movie.genre?.split(",")?.[0]?.trim() || ""}</span>
            }
          </CardMeta>
        </Info>
      </Card>
    </CardLink>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────
export default function Movies() {
  const { isDark } = useTheme();

  const [movies,      setMovies]      = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [category,    setCategory]    = useState("movie");
  const [sort,        setSort]        = useState("Latest");
  const [lang,        setLang]        = useState("");
  const [loading,     setLoading]     = useState(true);
  const [hasMore,     setHasMore]     = useState(true);
  const [error,       setError]       = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 600);
  const pageRef    = useRef(1);
  const loadingRef = useRef(false);

  // ── Chargement principal (liste OU recherche) ──────────────────────────
  // ⚡ Optimisation : les suggestions sont extraites des données déjà chargées
  //    → 1 seul appel API au lieu de 2
  useEffect(() => {
    let cancelled = false;
    pageRef.current = 1;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    setMovies([]);
    setSuggestions([]);

    const doFetch = async () => {
      try {
        let items = [], pager = {};

        if (debouncedSearch.trim()) {
          // ── Recherche ──
          const res = await axios.get(`${API_URL}/stream/search`, {
            params: {
              q:    debouncedSearch,
              page: 1,
              type: category === "movie" ? "Movie" : "TV",
            },
          });
          items = Array.isArray(res.data?.data) ? res.data.data : [];

        } else {
          // ── Liste filtrée ──
          const params = { category, page: 1, sort };
          if (lang) params.classify = lang;

          const res = await axios.get(`${API_URL}/stream/list`, { params });
          items = res.data?.data?.items || [];
          pager = res.data?.data?.pager || {};

          // ⚡ Suggestions = les 8 premiers items triés par popularité
          //    On évite un 2e appel API en réutilisant les données déjà là
          if (items.length > 0) {
            const sorted = [...items]
              .sort((a, b) => (b.imdbRatingValue || 0) - (a.imdbRatingValue || 0))
              .slice(0, 8);
            setSuggestions(sorted);
          }
        }

        if (cancelled) return;
        setMovies(items);
        setHasMore(pager.hasMore !== undefined ? pager.hasMore : items.length >= 12);
        pageRef.current = 2;

      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        setError(status === 429
          ? "Trop de requêtes. Patientez quelques secondes puis réessayez."
          : "Impossible de charger le contenu. Vérifiez votre connexion."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
          loadingRef.current = false;
        }
      }
    };

    doFetch();
    return () => { cancelled = true; };
  }, [debouncedSearch, category, sort, lang]);

  // ── Infinite scroll ───────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = async () => {
      if (loadingRef.current || !hasMore || debouncedSearch.trim()) return;
      const nearBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500;
      if (!nearBottom) return;

      loadingRef.current = true;
      setLoading(true);

      try {
        const params = { category, page: pageRef.current, sort };
        if (lang) params.classify = lang;
        const res = await axios.get(`${API_URL}/stream/list`, { params });
        const items = res.data?.data?.items || [];
        const pager = res.data?.data?.pager || {};
        setMovies(prev => [...prev, ...items]);
        setHasMore(pager.hasMore !== undefined ? pager.hasMore : items.length >= 12);
        pageRef.current += 1;
      } catch {
        // silencieux sur scroll
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore, debouncedSearch, category, sort, lang]);

  const currentLangFlag = LANG_OPTIONS.find(o => o.value === lang)?.flag || "🌐";

  return (
    <Page $isDark={isDark}>
      <Title $isDark={isDark}>Films & Séries</Title>

      {/* ── Filtres ── */}
      <FilterBar>
        <SearchWrapper>
          <SearchIconWrap $isDark={isDark} />
          <SearchInput
            placeholder={`Rechercher un ${category === "movie" ? "film" : "série"}…`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            $isDark={isDark}
          />
          {searchTerm && (
            <ClearBtn onClick={() => setSearchTerm("")} $isDark={isDark}>
              <FiX />
            </ClearBtn>
          )}
        </SearchWrapper>

        <ChipGroup>
          <Chip $active={category === "movie"} onClick={() => setCategory("movie")} $isDark={isDark}>
            <FiFilm size={14} /> Films
          </Chip>
          <Chip $active={category === "tv"} onClick={() => setCategory("tv")} $isDark={isDark}>
            <FiTv size={14} /> Séries
          </Chip>
        </ChipGroup>

        <Select value={lang} onChange={e => setLang(e.target.value)} $isDark={isDark}>
          {LANG_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.flag} {o.label}</option>
          ))}
        </Select>

        <Select value={sort} onChange={e => setSort(e.target.value)} $isDark={isDark}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </FilterBar>

      {error && <ErrorBox $isDark={isDark}>⚠️ {error}</ErrorBox>}

      {/* ── Grille principale ── */}
      {loading && movies.length === 0 ? (
        <Grid>
          {Array(12).fill(null).map((_, i) => <SkeletonCard key={i} $isDark={isDark} />)}
        </Grid>
      ) : movies.length === 0 ? (
        <StatusMsg $isDark={isDark}>
          {debouncedSearch
            ? <>Aucun résultat pour « <strong>{debouncedSearch}</strong> »<br /><small>Essayez d'autres mots-clés ou changez de langue</small></>
            : <>Aucun contenu disponible avec ces filtres.<br /><small>Essayez « Toutes les langues » ou un autre tri</small></>
          }
        </StatusMsg>
      ) : (
        <>
          <Grid>
            {movies.map((movie, i) => (
              <MovieCard key={movie.subjectId || i} movie={movie} lang={lang} />
            ))}
          </Grid>
          {loading && <LoadMsg $isDark={isDark}>Chargement…</LoadMsg>}
          {!hasMore && !loading && <LoadMsg $isDark={isDark}>— Fin des résultats —</LoadMsg>}
        </>
      )}

      {/* ── Suggestions (sans appel supplémentaire) ── */}
      {!debouncedSearch.trim() && suggestions.length > 0 && (
        <>
          <SectionTitle $isDark={isDark}>
            {currentLangFlag} {category === "movie" ? "Films populaires" : "Séries populaires"}
          </SectionTitle>
          <Grid>
            {suggestions.map((movie, i) => (
              <MovieCard key={`sug-${movie.subjectId || i}`} movie={movie} lang={lang} />
            ))}
          </Grid>
        </>
      )}
    </Page>
  );
}