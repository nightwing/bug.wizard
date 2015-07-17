# bug.wizard

Test plugin to duplicate the case of returning null with `document.getElementById` for an HTML element appended within `on('draw')` event of `Wizard` plugin.

You can see the `Buggy Wizard` either from the `Tools` menu, or from the `Commands` tab with `bug.wizard`.

Change TIMEOUT_DURATION_FOR_APPEND_FIX to something like 50 (milliseconds) to see that the C9 SDK elements will load.

When it is `0`, meaning `setTimeout` is not used, the elements fail to load.

According to Harutyun, this is a bug.