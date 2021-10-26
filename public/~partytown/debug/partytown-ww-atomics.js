(self => {
    const WinIdKey = Symbol();
    const InstanceIdKey = Symbol();
    const InterfaceTypeKey = Symbol();
    const NodeNameKey = Symbol();
    const webWorkerRefsByRefId = {};
    const webWorkerRefIdsByRef = new WeakMap;
    const webWorkerState = {};
    const webWorkerCtx = {};
    const environments = {};
    const toLower = str => str.toLowerCase();
    const toUpper = str => str.toUpperCase();
    const logWorker = (msg, winId = -1) => {
        try {
            if (webWorkerCtx.$config$.logStackTraces) {
                const frames = (new Error).stack.split("\n");
                const i = frames.findIndex((f => f.includes("logWorker")));
                msg += "\n" + frames.slice(i + 1).join("\n");
            }
            let prefix;
            let color;
            if (winId > -1) {
                prefix = `Worker (${normalizedWinId(winId)}) 🎉`;
                color = winColor(winId);
            } else {
                prefix = self.name;
                color = "#9844bf";
            }
            if (webWorkerCtx.lastLog !== msg) {
                webWorkerCtx.lastLog = msg;
                console.debug.apply(console, [ `%c${prefix}`, `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`, msg ]);
            }
        } catch (e) {}
    };
    const winIds = [];
    const normalizedWinId = winId => {
        winIds.includes(winId) || winIds.push(winId);
        return winIds.indexOf(winId) + 1;
    };
    const winColor = winId => {
        const colors = [ "#00309e", "#ea3655", "#eea727" ];
        return colors[normalizedWinId(winId) - 1] || colors[colors.length - 1];
    };
    const logWorkerGetter = (target, applyPath, rtnValue, restrictedToWorker = !1) => {
        if (webWorkerCtx.$config$.logGetters) {
            try {
                const msg = `Get ${logTargetProp(target, "Get", applyPath)}, returned: ${logValue(applyPath, rtnValue)}${restrictedToWorker ? " (restricted to worker)" : ""}`;
                msg.includes("Symbol(") || logWorker(msg, target[WinIdKey]);
            } catch (e) {}
        }
    };
    const logWorkerSetter = (target, applyPath, value, restrictedToWorker = !1) => {
        if (webWorkerCtx.$config$.logSetters) {
            try {
                logWorker(`Set ${logTargetProp(target, "Set", applyPath)}, value: ${logValue(applyPath, value)}${restrictedToWorker ? " (restricted to worker)" : ""}`, target[WinIdKey]);
            } catch (e) {}
        }
    };
    const logWorkerCall = (target, applyPath, args, rtnValue) => {
        if (webWorkerCtx.$config$.logCalls) {
            try {
                logWorker(`Call ${logTargetProp(target, "Call", applyPath)}(${args.map((v => logValue(applyPath, v))).join(", ")}), returned: ${logValue(applyPath, rtnValue)}`, target[WinIdKey]);
            } catch (e) {}
        }
    };
    const logTargetProp = (target, accessType, applyPath) => {
        let n = "";
        if (target) {
            const instanceId = target[InstanceIdKey];
            if (0 === instanceId) {
                n = "";
            } else if (1 === instanceId) {
                n = "document.";
            } else if (2 === instanceId) {
                n = "document.documentElement.";
            } else if (3 === instanceId) {
                n = "document.head.";
            } else if (4 === instanceId) {
                n = "document.body.";
            } else if (1 === target.nodeType) {
                n = toLower(target.nodeName) + ".";
            } else if (1 === target[InterfaceTypeKey] && target[NodeNameKey]) {
                n = `<${toLower(target[NodeNameKey])}>`;
            } else if (8 === target[InterfaceTypeKey]) {
                n = "comment.";
            } else if (2 === target[InterfaceTypeKey]) {
                n = "attributes.";
            } else if (11 === target[InterfaceTypeKey]) {
                n = "fragment.";
            } else if (10 === target[InterfaceTypeKey]) {
                n = "documentTypeNode.";
            } else if (20 === target[InterfaceTypeKey]) {
                n = "mutationObserver.";
            } else if (23 === target[InterfaceTypeKey]) {
                n = "resizeObserver.";
            } else if (target[InterfaceTypeKey] <= 11) {
                n = "node.";
            } else {
                n = "¯\\_(ツ)_/¯ TARGET.";
                console.warn("¯\\_(ツ)_/¯ TARGET", target);
            }
        }
        if ("Get" === accessType && applyPath.length > 1) {
            const first = applyPath.slice(0, applyPath.length - 1);
            const last = applyPath[applyPath.length - 1];
            if (!isNaN(last)) {
                return n + `${first.join(".")}[${last}]`;
            }
        }
        return n + applyPath.join(".");
    };
    const logValue = (applyPath, v) => {
        const type = typeof v;
        if (void 0 === v) {
            return "undefined";
        }
        if ("boolean" === type || "number" === type || null == v) {
            return JSON.stringify(v);
        }
        if ("string" === type) {
            return applyPath.includes("cookie") ? JSON.stringify(v.substr(0, 10) + "...") : JSON.stringify(v);
        }
        if (Array.isArray(v)) {
            return `[${v.map(logValue).join(", ")}]`;
        }
        if ("object" === type) {
            const instanceId = v[InstanceIdKey];
            return "number" == typeof instanceId ? 4 === instanceId ? "<body>" : 1 === instanceId ? "#document" : 2 === instanceId ? "<html>" : 3 === instanceId ? "<head>" : 0 === instanceId ? "window" : 1 === v[InterfaceTypeKey] && v[NodeNameKey] ? `<${toLower(v[NodeNameKey])}>` : 10 === v[InterfaceTypeKey] ? `<!DOCTYPE ${v[NodeNameKey]}>` : v[InterfaceTypeKey] <= 11 ? v[NodeNameKey] : "¯\\_(ツ)_/¯ instance obj" : v[Symbol.iterator] ? `[${Array.from(v).map((i => logValue(applyPath, i))).join(", ")}]` : objToString("value" in v ? v.value : v);
        }
        return (v => "object" == typeof v && v && v.then)(v) ? "Promise" : "function" === type ? `ƒ() ${v.name || ""}`.trim() : `¯\\_(ツ)_/¯ ${String(v)}`.trim();
    };
    const objToString = obj => {
        const s = [];
        for (let key in obj) {
            const value = obj[key];
            const type = typeof value;
            "string" === type ? s.push(`${key}: "${value}"`) : "function" === type ? s.push(`${key}: ƒ`) : Array.isArray(type) ? s.push(`${key}: [..]`) : "object" === type && value ? s.push(`${key}: {..}`) : s.push(`${key}: ${String(value)}`);
        }
        let str = s.join(", ");
        str.length > 200 && (str = str.substr(0, 200) + "..");
        return `{ ${str} }`;
    };
    const len = obj => obj.length;
    const defineConstructorName = (Cstr, value) => Object.defineProperty(Cstr, "name", {
        value: value
    });
    const nextTick = (cb, ms) => setTimeout(cb, ms);
    const EMPTY_ARRAY = [];
    Object.freeze(EMPTY_ARRAY);
    const randomId = () => Math.round(9999999999 * Math.random() + 4);
    const getInstanceStateValue = (instance, stateKey) => getStateValue(instance[InstanceIdKey], stateKey);
    const getStateValue = (instanceId, stateKey, stateRecord) => (stateRecord = webWorkerState[instanceId]) ? stateRecord[stateKey] : void 0;
    const setInstanceStateValue = (instance, stateKey, stateValue) => setStateValue(instance[InstanceIdKey], stateKey, stateValue);
    const setStateValue = (instanceId, stateKey, stateValue, stateRecord) => {
        (stateRecord = webWorkerState[instanceId] || {})[stateKey] = stateValue;
        webWorkerState[instanceId] = stateRecord;
    };
    const setWorkerRef = (ref, refId) => {
        if (!(refId = webWorkerRefIdsByRef.get(ref))) {
            webWorkerRefIdsByRef.set(ref, refId = randomId());
            webWorkerRefsByRefId[refId] = ref;
        }
        return refId;
    };
    class WorkerProxy {
        constructor(interfaceType, instanceId, winId, nodeName) {
            this[WinIdKey] = winId;
            this[InstanceIdKey] = instanceId;
            this[NodeNameKey] = nodeName;
            return proxy(this[InterfaceTypeKey] = interfaceType, this, []);
        }
    }
    const taskQueue = [];
    const queue = (instance, $applyPath$, isSetter, $assignInstanceId$) => {
        const $instanceId$ = instance[InstanceIdKey];
        taskQueue.push({
            $winId$: instance[WinIdKey],
            $instanceId$: $instanceId$,
            $interfaceType$: instance[InterfaceTypeKey],
            $nodeName$: instance[NodeNameKey],
            $applyPath$: $applyPath$,
            $assignInstanceId$: $assignInstanceId$
        });
        if (!isSetter) {
            return sync($instanceId$, $applyPath$);
        }
        setTimeout((() => sync($instanceId$, $applyPath$)), 50);
    };
    const sync = (instanceId, applyPath) => {
        if (len(taskQueue)) {
            const accessReq = {
                $msgId$: randomId(),
                $tasks$: taskQueue.slice()
            };
            taskQueue.length = 0;
            const accessRsp = ((webWorkerCtx, accessReq) => ({
                $msgId$: accessReq.$msgId$,
                $error$: "Atomics not implemented (yet)"
            }))(0, accessReq);
            deserializeFromMain(instanceId, applyPath, accessRsp.$rtnValue$);
            throw new Error(accessRsp.$error$);
        }
    };
    const getter = (instance, applyPath) => {
        const rtnValue = queue(instance, applyPath);
        logWorkerGetter(instance, applyPath, rtnValue);
        return rtnValue;
    };
    const setter = (instance, applyPath, value) => {
        const serializedValue = serializeInstanceForMain(instance, value);
        logWorkerSetter(instance, applyPath, value);
        queue(instance, [ ...applyPath, serializedValue, 0 ], !0);
    };
    const callMethod = (instance, applyPath, args, assignInstanceId) => {
        const isSetter = setterMethods.some((m => applyPath.includes(m)));
        const rtnValue = queue(instance, [ ...applyPath, serializeInstanceForMain(instance, args) ], isSetter, assignInstanceId);
        logWorkerCall(instance, applyPath, args, rtnValue);
        return rtnValue;
    };
    const createGlobalConstructorProxy = (winId, interfaceType, cstrName) => defineConstructorName(class {
        constructor(...args) {
            const instanceId = randomId();
            const workerProxy = new WorkerProxy(interfaceType, instanceId, winId);
            queue(workerProxy, [ 1, cstrName, serializeForMain(winId, instanceId, args) ]);
            ((winId, cstrName, args) => {
                if (webWorkerCtx.$config$.logCalls) {
                    try {
                        logWorker(`Construct new ${cstrName}(${args.map((v => logValue([], v))).join(", ")})`, winId);
                    } catch (e) {}
                }
            })(winId, cstrName, args);
            return workerProxy;
        }
    }, cstrName);
    const proxy = (interfaceType, target, initApplyPath) => !target || "object" != typeof target && "function" != typeof target || String(target).includes("[native") ? target : new Proxy(target, {
        get(target, propKey, receiver) {
            if ("symbol" == typeof propKey || Reflect.has(target, propKey)) {
                return Reflect.get(target, propKey, receiver);
            }
            if (shouldRestrictToWorker(interfaceType, propKey)) {
                if (Reflect.has(self, propKey)) {
                    return Reflect.get(self, propKey, receiver);
                }
                const globalRtnValue = target[propKey];
                logWorkerGetter(target, [ propKey ], globalRtnValue, !0);
                return globalRtnValue;
            }
            8 !== interfaceType && 10 !== interfaceType || (interfaceType = 3);
            const applyPath = [ ...initApplyPath, String(propKey) ];
            const interfaceInfo = webWorkerCtx.$interfaces$.find((i => i[0] === interfaceType));
            if (interfaceInfo) {
                const memberInfo = interfaceInfo[2][((applyPath, i) => {
                    for (i = len(applyPath) - 1; i >= 0; i--) {
                        if ("string" == typeof applyPath[i]) {
                            return applyPath[i];
                        }
                    }
                    return applyPath[0];
                })(applyPath)];
                if (13 === memberInfo) {
                    return (...args) => callMethod(target, applyPath, args);
                }
                if (memberInfo > 0) {
                    return proxy(memberInfo, target, [ ...applyPath ]);
                }
            }
            const stateValue = getInstanceStateValue(target, applyPath[0]);
            return "function" == typeof stateValue ? (...args) => {
                const rtnValue = stateValue.apply(target, args);
                logWorkerCall(target, applyPath, args, rtnValue);
                return rtnValue;
            } : getter(target, applyPath);
        },
        set(target, propKey, value, receiver) {
            if ("symbol" == typeof propKey || Reflect.has(target, propKey)) {
                Reflect.set(target, propKey, value, receiver);
            } else if (shouldRestrictToWorker(interfaceType, propKey)) {
                target[propKey] = value;
                logWorkerSetter(target, [ propKey ], value, !0);
            } else {
                setter(target, [ ...initApplyPath, propKey ], value);
            }
            return !0;
        },
        has: (target, propKey) => 0 === interfaceType || Reflect.has(target, propKey)
    });
    const shouldRestrictToWorker = (interfaceType, propKey) => 0 === interfaceType && (!webWorkerCtx.$windowMemberNames$.includes(propKey) || webWorkerCtx.$forwardedTriggers$.includes(propKey));
    const setterMethods = [ "addEventListener", "createElement", "setAttribute", "setItem" ];
    const constructInstance = (interfaceType, instanceId, winId, nodeName) => new (getConstructor(interfaceType, nodeName = 3 === interfaceType ? "#text" : 8 === interfaceType ? "#comment" : 11 === interfaceType ? "#document-fragment" : 10 === interfaceType ? "html" : nodeName))(interfaceType, instanceId, winId, nodeName);
    const getConstructor = (interfaceType, nodeName) => 1 === interfaceType ? getElementConstructor(nodeName) : interfaceType <= 11 ? self.Node : WorkerProxy;
    const getElementConstructor = nodeName => elementConstructors[nodeName] || elementConstructors.UNKNOWN;
    const elementConstructors = {};
    class NodeList {
        constructor(nodes) {
            (this._ = nodes).map(((node, index) => this[index] = node));
        }
        entries() {
            return this._.entries();
        }
        forEach(cb, thisArg) {
            this._.map(cb, thisArg);
        }
        item(index) {
            return this[index];
        }
        keys() {
            return this._.keys();
        }
        get length() {
            return len(this._);
        }
        values() {
            return this._.values();
        }
        [Symbol.iterator]() {
            return this._[Symbol.iterator]();
        }
    }
    const serializeForMain = ($winId$, $instanceId$, value, added) => {
        if (void 0 !== value) {
            let type = typeof value;
            if ("string" === type || "boolean" === type || "number" === type || null == value) {
                return [ 5, value ];
            }
            if ("function" === type) {
                return [ 6, {
                    $winId$: $winId$,
                    $instanceId$: $instanceId$,
                    $refId$: setWorkerRef(value)
                } ];
            }
            added = added || new Set;
            if (Array.isArray(value)) {
                return added.has(value) ? [ 0, [] ] : [ 0, value.map((v => serializeForMain($winId$, $instanceId$, v, added))) ];
            }
            if ("object" === type) {
                return "number" == typeof value[InstanceIdKey] ? [ 3, {
                    $winId$: value[WinIdKey],
                    $interfaceType$: value[InterfaceTypeKey],
                    $instanceId$: value[InstanceIdKey],
                    $nodeName$: value[NodeNameKey]
                } ] : value instanceof Event ? [ 1, serializeObjectForMain($winId$, $instanceId$, value, !1, added) ] : [ 4, serializeObjectForMain($winId$, $instanceId$, value, !0, added) ];
            }
        }
    };
    const serializeObjectForMain = (winId, instanceId, obj, includeFunctions, added, serializedObj, propName, propValue) => {
        serializedObj = {};
        if (!added.has(obj)) {
            added.add(obj);
            for (propName in obj) {
                propValue = obj[propName];
                (includeFunctions || "function" != typeof propValue) && (serializedObj[propName] = serializeForMain(winId, instanceId, propValue, added));
            }
        }
        return serializedObj;
    };
    const serializeInstanceForMain = (instance, value) => instance ? serializeForMain(instance[WinIdKey], instance[InstanceIdKey], value) : [ 5, value ];
    const deserializeFromMain = (instanceId, applyPath, serializedValueTransfer, serializedType, serializedValue) => {
        if (serializedValueTransfer) {
            serializedType = serializedValueTransfer[0];
            serializedValue = serializedValueTransfer[1];
            if (5 === serializedType) {
                return serializedValue;
            }
            if (6 === serializedType) {
                return deserializeRefFromMain(instanceId, applyPath, serializedValue);
            }
            if (3 === serializedType) {
                return constructSerializedInstance(serializedValue);
            }
            if (0 === serializedType) {
                return serializedValue.map((v => deserializeFromMain(instanceId, applyPath, v)));
            }
            if (1 === serializedType) {
                return (eventProps => new Proxy(new Event(eventProps.type, eventProps), {
                    get: (target, propName) => propName in eventProps ? eventProps[propName] : target[String(propName)]
                }))(deserializeObjectFromMain(instanceId, applyPath, serializedValue));
            }
            if (4 === serializedType) {
                return deserializeObjectFromMain(instanceId, applyPath, serializedValue);
            }
        }
    };
    const deserializeObjectFromMain = (instanceId, applyPath, serializedValue, obj, key) => {
        obj = {};
        for (key in serializedValue) {
            obj[key] = deserializeFromMain(instanceId, [ ...applyPath, key ], serializedValue[key]);
        }
        return obj;
    };
    const constructSerializedInstance = ({$interfaceType$: $interfaceType$, $instanceId$: $instanceId$, $winId$: $winId$, $nodeName$: $nodeName$, $data$: $data$}) => {
        const env = environments[$winId$];
        return 0 === $instanceId$ ? env.$window$ : 1 === $instanceId$ ? env.$document$ : 2 === $instanceId$ ? env.$documentElement$ : 3 === $instanceId$ ? env.$head$ : 4 === $instanceId$ ? env.$body$ : 21 === $interfaceType$ ? new NodeList($data$.map(constructSerializedInstance)) : constructInstance($interfaceType$, $instanceId$, $winId$, $nodeName$);
    };
    const deserializeRefFromMain = (instanceId, applyPath, {$winId$: $winId$, $refId$: $refId$}) => {
        webWorkerRefsByRefId[$refId$] || webWorkerRefIdsByRef.set(webWorkerRefsByRefId[$refId$] = function(...args) {
            const instance = constructInstance(0, instanceId, $winId$);
            return callMethod(instance, applyPath, args);
        }, $refId$);
        return webWorkerRefsByRefId[$refId$];
    };
    const runScriptContent = (env, instanceId, scriptContent, winId) => {
        let errorMsg = "";
        try {
            webWorkerCtx.$config$.logScriptExecution && logWorker(`Execute script (${instanceId}): ${scriptContent.substr(0, 100).split("\n").map((l => l.trim())).join(" ").trim().substr(0, 60)}...`, winId);
            env.$currentScriptId$ = instanceId;
            env.$currentScriptUrl$ = "";
            env.$run$(scriptContent);
        } catch (contentError) {
            console.error(scriptContent, contentError);
            errorMsg = String(contentError.stack || contentError) + "";
        }
        env.$currentScriptId$ = -1;
        env.$currentScriptUrl$ = "";
        return errorMsg;
    };
    const runStateLoadHandlers = (instanceId, type, handlers) => {
        (handlers = getStateValue(instanceId, type)) && nextTick((() => handlers.map((cb => cb({
            type: type
        })))));
    };
    const resolveToUrl = (env, url, baseLocation) => {
        baseLocation = env.$location$;
        while (!baseLocation.host) {
            baseLocation = (env = environments[env.$parentWinId$]).$location$;
            if (env.$isTop$) {
                break;
            }
        }
        return new URL(url || "", baseLocation);
    };
    const resolveUrl = (env, url) => resolveToUrl(env, url) + "";
    const getUrl = elm => resolveToUrl(getEnv(elm), getInstanceStateValue(elm, 3));
    const getPartytownScript = () => `<script src=${JSON.stringify(webWorkerCtx.$libPath$ + "partytown.js")} async defer><\/script>`;
    class Node extends WorkerProxy {
        appendChild(node) {
            return this.insertBefore(node, null);
        }
        get ownerDocument() {
            return getEnv(this).$document$;
        }
        get href() {}
        set href(_) {}
        insertBefore(newNode, referenceNode) {
            const winId = newNode[WinIdKey] = this[WinIdKey];
            const instanceId = newNode[InstanceIdKey];
            const nodeName = newNode[NodeNameKey];
            const isScript = "SCRIPT" === nodeName;
            const isIFrame = "IFRAME" === nodeName;
            if (isScript) {
                const scriptContent = getInstanceStateValue(newNode, 2);
                if (scriptContent) {
                    const errorMsg = runScriptContent(getEnv(newNode), instanceId, scriptContent, winId);
                    const datasetType = errorMsg ? "pterror" : "ptid";
                    const datasetValue = errorMsg || instanceId;
                    setter(newNode, [ "type" ], "text/partytown-x");
                    setter(newNode, [ "dataset", datasetType ], datasetValue);
                    setter(newNode, [ "innerHTML" ], scriptContent);
                }
            }
            newNode = callMethod(this, [ "insertBefore" ], [ newNode, referenceNode ]);
            isIFrame && (iframe => {
                let i = 0;
                const winId = iframe[InstanceIdKey];
                const callback = () => {
                    if (environments[winId] && environments[winId].$isInitialized$) {
                        let type = getInstanceStateValue(iframe, 1) ? "error" : "load";
                        let handlers = getInstanceStateValue(iframe, type);
                        handlers && handlers.map((handler => handler({
                            type: type
                        })));
                    } else if (i++ > 2e3) {
                        let errorHandlers = getInstanceStateValue(iframe, "error");
                        errorHandlers && errorHandlers.map((handler => handler({
                            type: "error"
                        })));
                        console.error("Timeout");
                    } else {
                        setTimeout(callback, 9);
                    }
                };
                callback();
            })(newNode);
            isScript && webWorkerCtx.$postMessage$([ 6, winId ]);
            return newNode;
        }
        get nodeName() {
            return this[NodeNameKey];
        }
        get nodeType() {
            return this[InterfaceTypeKey];
        }
    }
    class HTMLElement extends Node {
        get localName() {
            return toLower(this.nodeName);
        }
        get namespaceURI() {
            return "http://www.w3.org/1999/xhtml";
        }
        get tagName() {
            return this.nodeName;
        }
    }
    class HTMLSrcElement extends HTMLElement {
        addEventListener(...args) {
            let eventName = args[0];
            let callbacks = getInstanceStateValue(this, eventName) || [];
            callbacks.push(args[1]);
            setInstanceStateValue(this, eventName, callbacks);
        }
        get async() {
            return !0;
        }
        set async(_) {}
        get defer() {
            return !0;
        }
        set defer(_) {}
        get onload() {
            let callbacks = getInstanceStateValue(this, "load");
            return callbacks && callbacks[0] || null;
        }
        set onload(cb) {
            setInstanceStateValue(this, "load", cb ? [ cb ] : null);
        }
        get onerror() {
            let callbacks = getInstanceStateValue(this, "error");
            return callbacks && callbacks[0] || null;
        }
        set onerror(cb) {
            setInstanceStateValue(this, "error", cb ? [ cb ] : null);
        }
    }
    class HTMLDocument extends HTMLElement {
        get body() {
            return getEnv(this).$body$;
        }
        createElement(tagName) {
            tagName = toUpper(tagName);
            const winId = this[WinIdKey];
            const instanceId = randomId();
            const elm = new (getElementConstructor(tagName))(1, instanceId, winId, tagName);
            callMethod(this, [ "createElement" ], [ tagName ], instanceId);
            if ("IFRAME" === tagName) {
                createEnvironment({
                    $winId$: instanceId,
                    $parentWinId$: winId,
                    $url$: "about:blank"
                });
                setter(elm, [ "srcdoc" ], getPartytownScript());
            } else {
                "SCRIPT" === tagName && setter(elm, [ "type" ], "text/partytown");
            }
            return elm;
        }
        createEvent(type) {
            return new Event(type);
        }
        get currentScript() {
            const currentScriptId = getEnv(this).$currentScriptId$;
            return currentScriptId > 0 ? constructInstance(1, currentScriptId, this[WinIdKey], "SCRIPT") : null;
        }
        get defaultView() {
            return getEnvWindow(this);
        }
        get documentElement() {
            return getEnv(this).$documentElement$;
        }
        getElementsByTagName(tagName) {
            return "BODY" === (tagName = toUpper(tagName)) ? [ this.body ] : "HEAD" === tagName ? [ this.head ] : callMethod(this, [ "getElementsByTagName" ], [ tagName ]);
        }
        get head() {
            return getEnv(this).$head$;
        }
        get implementation() {
            return {
                hasFeature: () => !0
            };
        }
        get location() {
            return getEnv(this).$location$;
        }
        set location(url) {
            getEnv(this).$location$.href = url + "";
        }
        get parentNode() {
            return null;
        }
        get parentElement() {
            return null;
        }
        get readyState() {
            return "complete";
        }
    }
    const constructDocumentElementChild = (winId, instanceId, titleCaseNodeName, documentElement) => new (defineConstructorName(class extends HTMLElement {
        get parentElement() {
            return documentElement;
        }
        get parentNode() {
            return documentElement;
        }
    }, `HTML${titleCaseNodeName}Element`))(1, instanceId, winId, toUpper(titleCaseNodeName));
    const createImageConstructor = winId => class HTMLImageElement {
        constructor() {
            this.s = "";
            this.l = [];
            this.e = [];
        }
        get src() {
            return this.s;
        }
        set src(src) {
            const env = environments[winId];
            webWorkerCtx.$config$.logImageRequests && logWorker(`Image() request: ${resolveUrl(env, src)}`, winId);
            fetch(resolveUrl(env, src), {
                mode: "no-cors",
                keepalive: !0
            }).then((rsp => {
                rsp.ok ? this.l.map((cb => cb({
                    type: "load"
                }))) : this.e.map((cb => cb({
                    type: "error"
                })));
            }), (() => this.e.forEach((cb => cb({
                type: "error"
            })))));
        }
        addEventListener(eventName, cb) {
            "load" === eventName && this.l.push(cb);
            "error" === eventName && this.e.push(cb);
        }
        get onload() {
            return this.l[0];
        }
        set onload(cb) {
            this.l = [ cb ];
        }
        get onerror() {
            return this.e[0];
        }
        set onerror(cb) {
            this.e = [ cb ];
        }
    };
    class Location extends URL {
        assign() {
            logWorker("location.assign(), noop");
        }
        reload() {
            logWorker("location.reload(), noop");
        }
        replace() {
            logWorker("location.replace(), noop");
        }
    }
    const createEnvironment = ({$winId$: $winId$, $parentWinId$: $parentWinId$, $isTop$: $isTop$, $url$: $url$}) => {
        if (environments[$winId$]) {
            environments[$winId$].$location$.href = $url$;
        } else {
            class Window {
                constructor() {
                    initWindowInstance(this);
                    return proxy(0, this, []);
                }
                get document() {
                    return $document$;
                }
                get frameElement() {
                    if ($isTop$) {
                        return null;
                    }
                    const env = getEnv(this);
                    const iframeElementInstanceId = this[WinIdKey];
                    const iframeElementWinId = env.$parentWinId$;
                    return constructInstance(1, iframeElementInstanceId, iframeElementWinId, "IFRAME");
                }
                get globalThis() {
                    return getEnvWindow(this);
                }
                get location() {
                    return $location$;
                }
                set location(loc) {
                    $location$.href = loc + "";
                }
                get parent() {
                    return environments[$parentWinId$].$window$;
                }
                get self() {
                    return getEnvWindow(this);
                }
                get top() {
                    for (const envWinId in environments) {
                        if (environments[envWinId].$isTop$) {
                            return environments[envWinId].$window$;
                        }
                    }
                }
                get window() {
                    return getEnvWindow(this);
                }
            }
            const $document$ = new HTMLDocument(9, 1, $winId$, "#document");
            const $documentElement$ = new elementConstructors.HTML(1, 2, $winId$, "HTML");
            const $head$ = constructDocumentElementChild($winId$, 3, "Head", $documentElement$);
            const $body$ = constructDocumentElementChild($winId$, 4, "Body", $documentElement$);
            const $location$ = new Location($url$);
            const windowFunctionWhiteList = "addEventListener,removeEventListener,dispatchEvent,postMessage".split(",");
            const windowPropertyWhiteList = "devicePixelRatio,innerHeight,innerWidth,onmessage,onload,onerror".split(",");
            const initWindowInstance = win => {
                win[WinIdKey] = $winId$;
                win[InstanceIdKey] = win[InterfaceTypeKey] = 0;
                for (const globalName in self) {
                    "function" != typeof self[globalName] || globalName in win || (win[globalName] = self[globalName].bind(self));
                }
                Object.getOwnPropertyNames(self).map((globalName => {
                    globalName in win || (win[globalName] = self[globalName]);
                }));
                Object.keys(elementConstructors).map((tagName => win[elementConstructors[tagName].name] = elementConstructors[tagName]));
                webWorkerCtx.$windowMemberNames$.map((memberName => {
                    const $interfaceType$ = webWorkerCtx.$windowMembers$[memberName];
                    const isFunctionInterface = 13 === $interfaceType$;
                    !(isFunctionInterface || $interfaceType$ > 11) || memberName in win && !windowFunctionWhiteList.includes(memberName) || (win[memberName] = isFunctionInterface ? (...args) => callMethod(win, [ memberName ], args) : proxy($interfaceType$, win, [ "window", memberName ]));
                }));
                webWorkerCtx.$interfaces$.map((i => {
                    const interfaceType = i[0];
                    const memberName = i[1];
                    win[memberName] = createGlobalConstructorProxy($winId$, interfaceType, memberName);
                }));
                win.Image = createImageConstructor($winId$);
                win.Window = Window;
                win.performance = self.performance;
                win.name = name + `${normalizedWinId($winId$)} (${$winId$})`;
                win.navigator = (winId => {
                    const navigator = self.navigator;
                    navigator.sendBeacon = (url, body) => {
                        const env = environments[winId];
                        if (webWorkerCtx.$config$.logSendBeaconRequests) {
                            try {
                                logWorker(`sendBeacon: ${resolveUrl(env, url)}${body ? ", data: " + JSON.stringify(body) : ""}`);
                            } catch (e) {
                                console.error(e);
                            }
                        }
                        try {
                            fetch(resolveUrl(env, url), {
                                method: "POST",
                                body: body,
                                mode: "no-cors",
                                keepalive: !0
                            });
                            return !0;
                        } catch (e) {
                            console.error(e);
                            return !1;
                        }
                    };
                    return navigator;
                })($winId$);
                windowPropertyWhiteList.map((propName => Object.defineProperty(win, propName, {
                    get: () => getter($window$, [ propName ]),
                    set: value => setter($window$, [ propName ], value)
                })));
            };
            const $window$ = new Window;
            environments[$winId$] = {
                $winId$: $winId$,
                $parentWinId$: $parentWinId$,
                $window$: $window$,
                $document$: $document$,
                $documentElement$: $documentElement$,
                $head$: $head$,
                $body$: $body$,
                $location$: $location$,
                $isTop$: $isTop$,
                $run$: script => {
                    new Function(`with(this){${script}}`).apply($window$);
                }
            };
            logWorker(`Created ${$isTop$ ? "top" : "iframe"} window ${normalizedWinId($winId$)} environment (${$winId$})`, $winId$);
        }
        webWorkerCtx.$postMessage$([ 6, $winId$ ]);
    };
    const getEnv = instance => environments[instance[WinIdKey]];
    const getEnvWindow = instance => getEnv(instance).$window$;
    class HTMLAnchorElement extends HTMLElement {
        get hash() {
            return getUrl(this).hash;
        }
        get host() {
            return getUrl(this).host;
        }
        get hostname() {
            return getUrl(this).hostname;
        }
        get href() {
            return getUrl(this) + "";
        }
        set href(href) {
            setInstanceStateValue(this, 3, href += "");
            setter(this, [ "href" ], href);
        }
        get origin() {
            return getUrl(this).origin;
        }
        get pathname() {
            return getUrl(this).pathname;
        }
        get port() {
            return getUrl(this).port;
        }
        get protocol() {
            return getUrl(this).protocol;
        }
        get search() {
            return getUrl(this).search;
        }
    }
    class HTMLCanvasElement extends HTMLElement {
        getContext(...args) {
            return proxy(14, this, [ "getContext", serializeInstanceForMain(this, args) ]);
        }
    }
    class HTMLIFrameElement extends HTMLSrcElement {
        get contentDocument() {
            return this.contentWindow.document;
        }
        get contentWindow() {
            const iframeContentWinId = this[InstanceIdKey];
            return environments[iframeContentWinId].$window$;
        }
        get src() {
            return getInstanceStateValue(this, 3) || "";
        }
        set src(url) {
            let xhr = new XMLHttpRequest;
            let xhrStatus;
            url = resolveUrl(getEnv(this), url);
            setInstanceStateValue(this, 1, void 0);
            setInstanceStateValue(this, 3, url);
            xhr.open("GET", url, !1);
            xhr.send();
            xhrStatus = xhr.status;
            xhrStatus > 199 && xhrStatus < 300 ? setter(this, [ "srcdoc" ], ((url, html) => `<base href="${url}">` + html.replace(/<script>/g, '<script type="text/partytown">').replace(/<script /g, '<script type="text/partytown" ').replace(/text\/javascript/g, "text/partytown") + getPartytownScript())(url, xhr.responseText)) : setInstanceStateValue(this, 1, xhrStatus);
        }
    }
    class HTMLScriptElement extends HTMLSrcElement {
        get innerHTML() {
            return getInstanceStateValue(this, 2) || "";
        }
        set innerHTML(scriptContent) {
            setInstanceStateValue(this, 2, scriptContent);
        }
        get innerText() {
            return this.innerHTML;
        }
        set innerText(content) {
            this.innerHTML = content;
        }
        get src() {
            return getInstanceStateValue(this, 3) || "";
        }
        set src(url) {
            url = resolveUrl(getEnv(this), url);
            setInstanceStateValue(this, 3, url);
            setter(this, [ "src" ], url);
        }
        get textContent() {
            return this.innerHTML;
        }
        set textContent(content) {
            this.innerHTML = content;
        }
        get type() {
            return getter(this, [ "type" ]);
        }
        set type(type) {
            "text/javascript" !== type && setter(this, [ "type" ], type);
        }
    }
    const SheetKey = Symbol();
    class HTMLStyleElement extends HTMLElement {
        get sheet() {
            const ownerElement = this;
            if (void 0 === ownerElement[SheetKey]) {
                const sheetInfo = getter(ownerElement, [ "sheet" ]);
                if (null === sheetInfo) {
                    ownerElement[SheetKey] = sheetInfo;
                } else {
                    class CSSStyleSheet {
                        get cssRules() {
                            return sheetInfo.cssRules;
                        }
                        deleteRule(index) {
                            ownerElement[SheetKey] = void 0;
                            callMethod(ownerElement, [ "sheet", "deleteRule" ], [ index ]);
                        }
                        insertRule(rule, index) {
                            ownerElement[SheetKey] = void 0;
                            return callMethod(ownerElement, [ "sheet", "insertRule" ], [ rule, index ]);
                        }
                    }
                    ownerElement[SheetKey] = new CSSStyleSheet;
                }
            }
            return ownerElement[SheetKey];
        }
    }
    const initWebWorker = initWebWorkerData => {
        Object.assign(webWorkerCtx, initWebWorkerData);
        webWorkerCtx.$forwardedTriggers$ = (webWorkerCtx.$config$.forward || EMPTY_ARRAY).map((f => f[0]));
        webWorkerCtx.$windowMembers$ = webWorkerCtx.$interfaces$[0][2];
        webWorkerCtx.$windowMemberNames$ = Object.keys(webWorkerCtx.$windowMembers$).filter((m => !webWorkerCtx.$forwardedTriggers$.includes(m)));
        webWorkerCtx.$postMessage$ = postMessage.bind(self);
        self.postMessage = self.importScripts = void 0;
        self.Node = Node;
        self.Element = self.HTMLElement = HTMLSrcElement;
        self.Document = HTMLDocument;
        webWorkerCtx.$htmlConstructors$.map((htmlCstrName => elementConstructors[(t => ({
            IMAGE: "IMG",
            OLIST: "OL",
            PARAGRAPH: "P",
            TABLECELL: "TD",
            TABLEROW: "TR",
            ULIST: "UL"
        }[t = toUpper(t.substr(4).replace("Element", ""))] || t))(htmlCstrName)] = defineConstructorName(class extends HTMLElement {}, htmlCstrName)));
        elementConstructors.A = HTMLAnchorElement;
        elementConstructors.CANVAS = HTMLCanvasElement;
        elementConstructors.IFRAME = HTMLIFrameElement;
        elementConstructors.SCRIPT = HTMLScriptElement;
        elementConstructors.STYLE = HTMLStyleElement;
        webWorkerCtx.$isInitialized$ = 1;
        logWorker("Initialized web worker");
    };
    const queuedEvents = [];
    const receiveMessageFromSandboxToWorker = ev => {
        const msg = ev.data;
        const msgType = msg[0];
        if (webWorkerCtx.$isInitialized$) {
            if (6 === msgType) {
                (async initScript => {
                    let winId = initScript.$winId$;
                    let instanceId = initScript.$instanceId$;
                    let scriptContent = initScript.$content$;
                    let scriptSrc = initScript.$url$;
                    let errorMsg = "";
                    let env = environments[winId];
                    let rsp;
                    let scriptUrl;
                    if (scriptSrc) {
                        try {
                            scriptUrl = resolveToUrl(env, scriptSrc);
                            scriptSrc = scriptUrl + "";
                            setStateValue(instanceId, 3, scriptSrc);
                            webWorkerCtx.$config$.logScriptExecution && logWorker(`Execute script (${instanceId}) src: ${scriptSrc}`, winId);
                            if (scriptUrl.origin !== origin) {
                                try {
                                    await self.fetch(scriptSrc, {
                                        method: "OPTIONS"
                                    });
                                } catch (e) {
                                    scriptSrc = "https://partytown.builder.io/api/proxy?p=" + scriptSrc;
                                    logWorker(`Proxied script (${instanceId}) src: ${scriptSrc}`, winId);
                                }
                            }
                            rsp = await self.fetch(scriptSrc);
                            if (rsp.ok) {
                                scriptContent = await rsp.text();
                                env.$currentScriptId$ = instanceId;
                                env.$currentScriptUrl$ = scriptSrc;
                                env.$run$(scriptContent);
                                runStateLoadHandlers(instanceId, "load");
                            } else {
                                console.error(rsp.status, "url:", scriptSrc);
                                errorMsg = rsp.statusText;
                                runStateLoadHandlers(instanceId, "error");
                            }
                        } catch (urlError) {
                            console.error("url:", scriptSrc, urlError);
                            errorMsg = String(urlError.stack || urlError) + "";
                            runStateLoadHandlers(instanceId, "error");
                        }
                    } else {
                        scriptContent && (errorMsg = runScriptContent(env, instanceId, scriptContent, winId));
                    }
                    env.$currentScriptId$ = -1;
                    env.$currentScriptUrl$ = "";
                    webWorkerCtx.$postMessage$([ 5, winId, instanceId, errorMsg ]);
                })(msg[1]);
            } else if (7 === msgType) {
                (({$instanceId$: $instanceId$, $refId$: $refId$, $thisArg$: $thisArg$, $args$: $args$}) => {
                    if (webWorkerRefsByRefId[$refId$]) {
                        try {
                            const thisArg = deserializeFromMain($instanceId$, [], $thisArg$);
                            const args = deserializeFromMain($instanceId$, [], $args$);
                            webWorkerRefsByRefId[$refId$].apply(thisArg, args);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                })(msg[1]);
            } else if (8 === msgType) {
                (({$winId$: $winId$, $instanceId$: $instanceId$, $forward$: $forward$, $args$: $args$}) => {
                    try {
                        const win = environments[$winId$].$window$;
                        const target = $forward$[0] in win ? win : $forward$[0] in self ? self : {};
                        const args = deserializeFromMain($instanceId$, [], $args$);
                        const globalProperty = target[$forward$[0]];
                        Array.isArray(globalProperty) ? globalProperty.push(...args) : "function" == typeof globalProperty && globalProperty.apply(target, args);
                    } catch (e) {
                        console.error(e);
                    }
                })(msg[1]);
            } else if (3 === msgType) {
                createEnvironment(msg[1]);
            } else if (4 === msgType) {
                environments[msg[1]].$isInitialized$ = 1;
                {
                    const winId = msg[1];
                    const winType = environments[winId].$isTop$ ? "top" : "iframe";
                    logWorker(`Initialized ${winType} window ${normalizedWinId(winId)} environment (${winId}) 🎉`, winId);
                }
            }
        } else if (1 === msgType) {
            initWebWorker(msg[1]);
            webWorkerCtx.$postMessage$([ 2 ]);
            nextTick((() => {
                queuedEvents.length && logWorker(`Queued ready messages: ${queuedEvents.length}`);
                queuedEvents.slice().forEach(receiveMessageFromSandboxToWorker);
                queuedEvents.length = 0;
            }));
        } else {
            queuedEvents.push(ev);
        }
    };
    self.onmessage = receiveMessageFromSandboxToWorker;
    postMessage([ 0 ]);
})(self);
