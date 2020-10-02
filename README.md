Directory tree:

```
.
├── package.json
├── src
│   ├── entrypoint.tsx
│   ├── index.html
│   └── ui
│       ├── App.tsx
│       └── shared
│           └── Reset.ts
├── start.sh
└── tsconfig.json
```

TypeScript's `tsconfig.json` sets `paths` to
[Parcel's `~` module resolution convention](https://parceljs.org/module_resolution.html#~-tilde-paths)
and `baseUrl` to `src` directory.

Parcel is given `src/index.html` as its input,
which references `src/entrypoint.tsx`.

All TypeScript files in `src`
may use the `~` non-relative import paths.