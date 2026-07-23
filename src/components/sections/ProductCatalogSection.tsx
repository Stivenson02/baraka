"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  LoaderCircle,
  PackageSearch,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brandAssets } from "@/lib/brand";
import type { Brand } from "@/types/brand.type";
import type { Category } from "@/types/category.type";
import type { Product } from "@/types/product.type";

const CATALOG_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 350;

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type ProductsResponse = {
  success?: boolean;
  data?: Product[];
  pagination?: Pagination;
  error?: { message?: string };
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getProductImageUrl(product: Product) {
  return product.imageUrl || product.image?.file.url || null;
}

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debounced;
}

function normalizeSearch(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");

  return normalized.length >= 3 ? normalized : "";
}

function MultiSelectFilter({
  label,
  placeholder,
  items,
  selectedIds,
  onChange,
}: {
  label: string;
  placeholder: string;
  items: Array<{ id: string; name: string }>;
  selectedIds: string[];
  onChange: (value: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const selectedItems = useMemo(() => {
    const selected = new Set(selectedIds);
    return items.filter((item) => selected.has(item.id));
  }, [items, selectedIds]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const selected = new Set(selectedIds);

    return items.filter((item) => {
      if (selected.has(item.id)) return false;
      if (!normalizedQuery) return true;
      return item.name.toLowerCase().includes(normalizedQuery);
    });
  }, [items, query, selectedIds]);

  function handleSelect(id: string) {
    onChange([...selectedIds, id]);
    setQuery("");
    setOpen(true);
  }

  return (
    <div ref={containerRef} className="space-y-2">
      <label className="text-sm font-medium text-brand-text">{label}</label>
      <div className="rounded-lg border border-black/10 bg-brand-soft px-3 py-3">
        {selectedItems.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-semibold text-brand-purple-dark"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => onChange(selectedIds.filter((id) => id !== item.id))}
                  aria-label={`Quitar ${item.name}`}
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="h-10 bg-white"
          />

          {open && filteredItems.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-56 overflow-y-auto rounded-lg border border-black/10 bg-white p-2 shadow-lg">
              {filteredItems.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-brand-text transition hover:bg-brand-purple hover:text-white"
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product);
  const price = product.price?.amount ? formatCOP(product.price.amount) : "Precio por confirmar";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-white">
        {imageUrl ? (
          // LK product images are remote; this keeps rendering independent from image domain config.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brandAssets.isotipo}
            alt=""
            className="h-20 w-20 object-contain opacity-60"
            loading="lazy"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-xs font-semibold text-brand-purple-dark shadow-sm">
          {product.brand?.name ?? product.category?.name ?? "BARAKA"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-brand-muted">
          {product.category?.name ?? "Producto"}
        </p>
        <h3 className="mt-1 min-h-10 text-sm font-semibold leading-5 text-brand-text">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-brand-muted">
          {product.description || "Producto disponible para pedido en BARAKA."}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-lg font-bold text-brand-text">{price}</p>
            <p className="text-xs text-brand-muted">Pedido disponible</p>
          </div>
          <Button
            type="button"
            size="icon-lg"
            className="bg-brand-purple text-white hover:bg-brand-purple-hover"
            aria-label={`Agregar ${product.name}`}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm">
      <div className="aspect-[4/3] animate-pulse rounded-lg bg-brand-soft" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-brand-soft" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-brand-soft" />
        <div className="h-3 w-full animate-pulse rounded bg-brand-soft" />
        <div className="h-5 w-28 animate-pulse rounded bg-brand-soft" />
      </div>
    </div>
  );
}

export function ProductCatalogSection() {
  const [search, setSearch] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [showAdvancedMobile, setShowAdvancedMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const autoLoadedSecondPage = useRef(false);
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
  const activeSearch = normalizeSearch(debouncedSearch);
  const hasNextPage = Boolean(pagination && pagination.page < pagination.totalPages);
  const showBackToCatalogTop = page >= 2 || products.length > CATALOG_LIMIT;

  useEffect(() => {
    async function fetchFilters() {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);
        const [brandsJson, categoriesJson] = await Promise.all([
          brandsRes.json(),
          categoriesRes.json(),
        ]);

        if (brandsJson?.success) setBrands(brandsJson.data ?? []);
        if (categoriesJson?.success) setCategories(categoriesJson.data ?? []);
      } catch {
        // Filters are helpful, but the catalog can still load without them.
      }
    }

    fetchFilters();
  }, []);

  const fetchProducts = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const query = new URLSearchParams();

      query.set("page", String(nextPage));
      query.set("limit", String(CATALOG_LIMIT));
      selectedBrandIds.forEach((brandId) => query.append("brandId", brandId));
      selectedCategoryIds.forEach((categoryId) => query.append("categoryId", categoryId));
      if (activeSearch) query.set("search", activeSearch);

      if (mode === "replace") {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError("");

      try {
        const response = await fetch(`/api/products?${query.toString()}`);
        const json = (await response.json()) as ProductsResponse;

        if (!response.ok || !json?.success) {
          throw new Error(json?.error?.message ?? "No pudimos cargar productos.");
        }

        setProducts((current) =>
          mode === "replace" ? json.data ?? [] : [...current, ...(json.data ?? [])]
        );
        setPagination(json.pagination ?? null);
        setPage(json.pagination?.page ?? nextPage);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "No pudimos cargar productos."
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeSearch, selectedBrandIds, selectedCategoryIds]
  );

  useEffect(() => {
    queueMicrotask(() => {
      autoLoadedSecondPage.current = false;
      fetchProducts(1, "replace");
    });
  }, [fetchProducts]);

  useEffect(() => {
    if (
      loading ||
      loadingMore ||
      autoLoadedSecondPage.current ||
      page !== 1 ||
      !hasNextPage
    ) {
      return;
    }

    autoLoadedSecondPage.current = true;
    fetchProducts(2, "append");
  }, [fetchProducts, hasNextPage, loading, loadingMore, page]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;

    if (!sentinel || !hasNextPage || page < 2 || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry?.isIntersecting && !loadingMore) {
          fetchProducts(page + 1, "append");
        }
      },
      { rootMargin: "900px 0px", threshold: 0 }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchProducts, hasNextPage, loadingMore, page]);

  function scrollToCatalogTop() {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="productos"
      ref={sectionRef}
      className="mx-auto max-w-7xl scroll-mt-28 px-4 pb-12 pt-8 sm:px-6 lg:px-8"
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-purple-dark">Productos destacados</p>
          <h2 className="text-2xl font-bold text-brand-text sm:text-3xl">
            Lo que queremos empujar primero
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">
            Explora el catalogo de BARAKA, filtra por producto, marca o categoria y arma tu
            pedido sin friccion.
          </p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-muted shadow-sm">
          {pagination?.total ?? products.length} resultado
          {(pagination?.total ?? products.length) === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-brand-purple-dark">
          <SlidersHorizontal className="size-5" />
          <h3 className="font-semibold text-brand-text">Filtrar productos</h3>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <label className="grid gap-2 text-sm font-medium text-brand-text">
            Buscar por nombre
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ej. hogar, cocina, freidora..."
                className="h-10 bg-brand-soft pl-10 pr-10"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted transition hover:text-brand-text"
                  aria-label="Limpiar busqueda"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </label>

          <div className="hidden lg:block">
            <MultiSelectFilter
              label="Filtrar por marca"
              placeholder="Escribe una marca..."
              items={brands}
              selectedIds={selectedBrandIds}
              onChange={setSelectedBrandIds}
            />
          </div>

          <div className="hidden lg:block">
            <MultiSelectFilter
              label="Filtrar por categoria"
              placeholder="Escribe una categoria..."
              items={categories}
              selectedIds={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
            />
          </div>

          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setShowAdvancedMobile((current) => !current)}
              className="flex w-full items-center justify-between rounded-lg border border-black/10 bg-brand-soft px-4 py-3 text-left text-sm font-semibold text-brand-text"
            >
              Filtros avanzados
              <ChevronDown
                className={`size-5 text-brand-muted transition ${
                  showAdvancedMobile ? "rotate-180" : ""
                }`}
              />
            </button>

            {showAdvancedMobile && (
              <div className="mt-4 grid gap-4">
                <MultiSelectFilter
                  label="Filtrar por marca"
                  placeholder="Escribe una marca..."
                  items={brands}
                  selectedIds={selectedBrandIds}
                  onChange={setSelectedBrandIds}
                />
                <MultiSelectFilter
                  label="Filtrar por categoria"
                  placeholder="Escribe una categoria..."
                  items={categories}
                  selectedIds={selectedCategoryIds}
                  onChange={setSelectedCategoryIds}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {!loading && !error && !products.length ? (
        <div className="rounded-lg border border-dashed border-black/10 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple-dark">
            <PackageSearch className="size-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-brand-text">
            No encontramos productos
          </h3>
          <p className="mt-2 text-sm text-brand-muted">
            Prueba limpiando filtros o buscando con otra palabra.
          </p>
        </div>
      ) : null}

      {products.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div
            ref={loadMoreRef}
            className="mt-6 flex min-h-20 items-center justify-center rounded-lg bg-white px-5 py-4 text-center shadow-sm"
          >
            {loadingMore ? (
              <div className="flex items-center gap-3 text-sm font-medium text-brand-muted">
                <LoaderCircle className="size-4 animate-spin text-brand-purple-dark" />
                Cargando mas productos...
              </div>
            ) : hasNextPage ? (
              <p className="text-sm text-brand-muted">Sigue bajando para ver mas productos.</p>
            ) : (
              <p className="text-sm text-brand-muted">
                Ya viste todos los productos disponibles.
              </p>
            )}
          </div>
        </>
      )}

      {showBackToCatalogTop && (
        <button
          type="button"
          onClick={scrollToCatalogTop}
          className="fixed bottom-6 right-5 z-40 flex size-11 items-center justify-center rounded-full bg-brand-purple text-white shadow-lg shadow-brand-purple/25 transition hover:bg-brand-purple-hover"
          aria-label="Volver al inicio de productos"
        >
          <ArrowUp className="size-5" />
        </button>
      )}
    </section>
  );
}
