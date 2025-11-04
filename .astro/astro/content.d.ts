declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"commands": {
"awk.mdx": {
	id: "awk.mdx";
  slug: "awk";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"cat.mdx": {
	id: "cat.mdx";
  slug: "cat";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"chmod.mdx": {
	id: "chmod.mdx";
  slug: "chmod";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"chown.mdx": {
	id: "chown.mdx";
  slug: "chown";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"cp.mdx": {
	id: "cp.mdx";
  slug: "cp";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"curl.mdx": {
	id: "curl.mdx";
  slug: "curl";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"cut.mdx": {
	id: "cut.mdx";
  slug: "cut";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"df.mdx": {
	id: "df.mdx";
  slug: "df";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"du.mdx": {
	id: "du.mdx";
  slug: "du";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"echo.mdx": {
	id: "echo.mdx";
  slug: "echo";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"find.mdx": {
	id: "find.mdx";
  slug: "find";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"grep.mdx": {
	id: "grep.mdx";
  slug: "grep";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"head.mdx": {
	id: "head.mdx";
  slug: "head";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"less.mdx": {
	id: "less.mdx";
  slug: "less";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"ln.mdx": {
	id: "ln.mdx";
  slug: "ln";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"ls.mdx": {
	id: "ls.mdx";
  slug: "ls";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"mkdir.mdx": {
	id: "mkdir.mdx";
  slug: "mkdir";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"mv.mdx": {
	id: "mv.mdx";
  slug: "mv";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"ps.mdx": {
	id: "ps.mdx";
  slug: "ps";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"rm.mdx": {
	id: "rm.mdx";
  slug: "rm";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"rmdir.mdx": {
	id: "rmdir.mdx";
  slug: "rmdir";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"sed.mdx": {
	id: "sed.mdx";
  slug: "sed";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"sort.mdx": {
	id: "sort.mdx";
  slug: "sort";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"tail.mdx": {
	id: "tail.mdx";
  slug: "tail";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"tar.mdx": {
	id: "tar.mdx";
  slug: "tar";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"tee.mdx": {
	id: "tee.mdx";
  slug: "tee";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"touch.mdx": {
	id: "touch.mdx";
  slug: "touch";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"tr.mdx": {
	id: "tr.mdx";
  slug: "tr";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"uniq.mdx": {
	id: "uniq.mdx";
  slug: "uniq";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"wc.mdx": {
	id: "wc.mdx";
  slug: "wc";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
"xargs.mdx": {
	id: "xargs.mdx";
  slug: "xargs";
  body: string;
  collection: "commands";
  data: InferEntrySchema<"commands">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
