# Actual input event manager plugin for Angular

Internet Explorer 10+ implements 'input' event but it erroneously fires under various situations, e.g. when placeholder changes, or a control is focused.
[Link to issue](https://connect.microsoft.com/IE/feedbackdetail/view/856700).

This plugin prevents an otherwise pristine field from being dirtied in this cases.


## Usage:
1. npm install angular-actual-input-event-manager-plugin
2. 
```
    import { ACTUAL_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER } from 'angular-actual-input-event-manager-plugin';
    ...
    @NgModule({
        ...
        providers: [
            ...
            ACTUAL_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER,
        ],
    })
    export class CoreModule { ... }

```

### Recommendation:
Provide this plugin only for Internet Explorer 10+, e.g. using User-Agent string parser.
```
    import { UAParser } from 'ua-parser-js';
    import { ACTUAL_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER } from 'angular-actual-input-event-manager-plugin';
    ...
    const browser = (new UAParser()).getBrowser();
    @NgModule({
        ...
        providers: [
            ...
            browser.name === 'IE' && parseInt(browser.version, 10) <= 11 
                ? [ACTUAL_INPUT_EVENT_MANAGER_PLUGIN_PROVIDER]
                : [],
        ],
    })
    export class CoreModule { ... }

```