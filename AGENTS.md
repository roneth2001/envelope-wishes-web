<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the birthday experience on the public index route with envelope and card states, because it is one continuous personal greeting.
- Load Firebase browser SDK lazily from effects and user actions, because server rendering must not initialize browser database listeners.
- Use Firestore birthdayWishes with realtime public reads and validated create-only messages; require web configuration before saving so the UI never claims unsaved wishes are shared.
- Keep stationery styling and visual tokens in src/styles.css, because the envelope and card should share one coherent design system.
