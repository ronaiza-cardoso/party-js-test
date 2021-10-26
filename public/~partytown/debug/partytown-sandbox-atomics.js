const noop = () => {};

const logMain = msg => {
    console.debug.apply(console, [ "%cMain 🌎", "background: #717171; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;", msg ]);
};

const winIds = [];

const normalizedWinId = winId => {
    winIds.includes(winId) || winIds.push(winId);
    return winIds.indexOf(winId) + 1;
};

const len = obj => obj.length;

const getConstructorName = obj => obj && obj.constructor && obj.constructor.name || "";

const startsWith = (str, val) => str.startsWith(val);

const isValidMemberName = memberName => !startsWith(memberName, "webkit") && !startsWith(memberName, "toJSON") && (!startsWith(memberName, "on") || (str => str.toLowerCase())(memberName) !== memberName);

const EMPTY_ARRAY = [];

Object.freeze(EMPTY_ARRAY);

const randomId = () => Math.round(9999999999 * Math.random() + 4);

const instanceIds = new WeakMap;

const winCtxs = {};

const windowIds = new WeakMap;

const getAndSetInstanceId = (instance, instanceId, nodeName) => {
    if (instance) {
        if (instance === instance.window) {
            return 0;
        }
        if ("#document" === (nodeName = instance.nodeName)) {
            return 1;
        }
        if ("HTML" === nodeName) {
            return 2;
        }
        if ("HEAD" === nodeName) {
            return 3;
        }
        if ("BODY" === nodeName) {
            return 4;
        }
        "number" != typeof (instanceId = instanceIds.get(instance)) && setInstanceId(instance, instanceId = randomId());
        return instanceId;
    }
    return -1;
};

const setInstanceId = (instance, instanceId) => {
    instance && instanceIds.set(instance, instanceId);
};

const serializeForWorker = ($winId$, value, added, type, cstrName) => {
    if (void 0 !== value) {
        if ("string" === (type = typeof value) || "number" === type || "boolean" === type || null == value) {
            return [ 5, value ];
        }
        if ("function" === type) {
            return [ 2 ];
        }
        added = added || new Set;
        if (Array.isArray(value)) {
            if (!added.has(value)) {
                added.add(value);
                return [ 0, value.map((v => serializeForWorker($winId$, v, added))) ];
            }
            return [ 0, [] ];
        }
        if ("object" === type) {
            return value.nodeType ? [ 3, {
                $winId$: $winId$,
                $interfaceType$: value.nodeType,
                $instanceId$: getAndSetInstanceId(value),
                $nodeName$: value.nodeName
            } ] : "Window" === (cstrName = getConstructorName(value)) ? [ 3, {
                $winId$: $winId$,
                $interfaceType$: 0,
                $instanceId$: 0
            } ] : "HTMLCollection" === cstrName || "NodeList" === cstrName ? [ 3, {
                $winId$: $winId$,
                $interfaceType$: 21,
                $data$: Array.from(value).map((v => serializeForWorker($winId$, v, added)[1]))
            } ] : "Event" === cstrName ? [ 1, serializeObjectForWorker($winId$, value, added) ] : "CSSStyleDeclaration" === cstrName ? [ 4, serializeObjectForWorker($winId$, value, added) ] : [ 4, serializeObjectForWorker($winId$, value, added, !0, !0) ];
        }
    }
};

const serializeObjectForWorker = (winId, obj, added, includeFunctions, includeEmptyStrings, serializedObj, propName, propValue) => {
    serializedObj = {};
    if (!added.has(obj)) {
        added.add(obj);
        for (propName in obj) {
            propValue = obj[propName];
            isValidMemberName(propName) && (includeFunctions || "function" != typeof propValue) && (includeEmptyStrings || "" !== propValue) && (serializedObj[propName] = serializeForWorker(winId, propValue, added));
        }
    }
    return serializedObj;
};

const readNextScript = (worker, winCtx) => {
    let $winId$ = winCtx.$winId$;
    let win = winCtx.$window$;
    let doc = win.document;
    let scriptSelector = 'script[type="text/partytown"]:not([data-ptid]):not([data-pterror])';
    let scriptElm = doc.querySelector('script[type="text/partytown"]:not([data-ptid]):not([data-pterror]):not([async]):not([defer])');
    let $instanceId$;
    let scriptData;
    scriptElm || (scriptElm = doc.querySelector(scriptSelector));
    if (scriptElm) {
        scriptElm.dataset.ptid = $instanceId$ = getAndSetInstanceId(scriptElm, $winId$);
        scriptData = {
            $winId$: $winId$,
            $instanceId$: $instanceId$
        };
        scriptElm.src ? scriptData.$url$ = scriptElm.src : scriptData.$content$ = scriptElm.innerHTML;
        worker.postMessage([ 6, scriptData ]);
    } else if (!winCtx.$isInitialized$) {
        winCtx.$isInitialized$ = 1;
        ((worker, $winId$, win) => {
            let existingTriggers = win._ptf;
            let forwardTriggers = win._ptf = [];
            let i = 0;
            forwardTriggers.push = ($forward$, $args$) => worker.postMessage([ 8, {
                $winId$: $winId$,
                $instanceId$: 0,
                $forward$: $forward$,
                $args$: serializeForWorker($winId$, Array.from($args$))
            } ]);
            if (existingTriggers) {
                for (;i < len(existingTriggers); i += 2) {
                    forwardTriggers.push(existingTriggers[i], existingTriggers[i + 1]);
                }
            }
        })(worker, $winId$, win);
        doc.dispatchEvent(new CustomEvent("pt0"));
        {
            const winType = win === win.top ? "top" : "iframe";
            logMain(`Executed ${winType} window ${normalizedWinId($winId$)} environment scripts in ${(performance.now() - winCtx.$startTime$).toFixed(1)}ms`);
        }
        worker.postMessage([ 4, $winId$ ]);
    }
};

const registerWindow = (worker, $winId$, $window$, $isTop$) => {
    if (!windowIds.has($window$)) {
        windowIds.set($window$, $winId$);
        const doc = $window$.document;
        const $url$ = doc.baseURI;
        const envData = {
            $winId$: $winId$,
            $parentWinId$: windowIds.get($window$.parent),
            $isTop$: $isTop$,
            $url$: $url$
        };
        const sendInitEnvData = () => worker.postMessage([ 3, envData ]);
        winCtxs[$winId$] = {
            $winId$: $winId$,
            $window$: $window$,
            $url$: $url$
        };
        winCtxs[$winId$].$startTime$ = performance.now();
        {
            const winType = envData.$isTop$ ? "top" : "iframe";
            logMain(`Registered ${winType} window ${normalizedWinId($winId$)} (${$winId$})`);
        }
        "complete" === doc.readyState ? sendInitEnvData() : $window$.addEventListener("load", sendInitEnvData);
    }
};

const onMessageFromWebWorker = (worker, mainWindow, msg) => {
    const msgType = msg[0];
    if (0 === msgType) {
        const initWebWorkerData = (win => {
            const doc = win.document;
            const $config$ = win.partytown || {};
            const $libPath$ = ($config$.lib || "/~partytown/") + "debug/";
            const $url$ = win.location + "";
            const docImpl = doc.implementation.createHTMLDocument();
            const inputElm = docImpl.createElement("input");
            const canvasRenderingContext2D = docImpl.createElement("canvas").getContext("2d");
            const implementations = [ [ 0, win ], [ 15, inputElm.style ], [ 9, docImpl ], [ 11, docImpl.createDocumentFragment() ], [ 16, inputElm.dataset ], [ 17, inputElm.classList ], [ 1, inputElm ], [ 14, canvasRenderingContext2D ], [ 18, win.history ], [ 19, win.location ], [ 20, new MutationObserver(noop) ], [ 22, inputElm.attributes ], [ 21, inputElm.childNodes ], [ 23, new ResizeObserver(noop) ], [ 24, win.screen ], [ 25, win.localStorage ], [ 3, docImpl.createTextNode("") ] ].map((i => [ ...i, getConstructorName(i[1]) ]));
            const initWebWorkerData = {
                $config$: $config$,
                $libPath$: new URL($libPath$, $url$) + "",
                $htmlConstructors$: Object.getOwnPropertyNames(win).filter((c => /^H.*t$/i.test(c))),
                $interfaces$: implementations.map((([interfaceType, impl, cstrName]) => {
                    let memberName;
                    let value;
                    let type;
                    let objCstrName;
                    let objImpl;
                    let interfaceInfo = [ interfaceType, cstrName, {} ];
                    for (memberName in impl) {
                        if (isValidMemberName(memberName)) {
                            value = impl[memberName];
                            type = typeof value;
                            if ("function" === type) {
                                interfaceInfo[2][memberName] = 13;
                            } else if ("object" === type) {
                                objCstrName = getConstructorName(value);
                                objImpl = implementations.find((i => i[2] === objCstrName));
                                objImpl && (interfaceInfo[2][memberName] = objImpl[0]);
                            }
                        }
                    }
                    return interfaceInfo;
                }))
            };
            logMain(`Read main window, interfaces: ${initWebWorkerData.$interfaces$.length}, HTML Constructors: ${initWebWorkerData.$htmlConstructors$.length}`);
            return initWebWorkerData;
        })(mainWindow);
        worker.postMessage([ 1, initWebWorkerData ]);
    } else if (2 === msgType) {
        registerWindow(worker, randomId(), mainWindow, 1);
    } else {
        const winCtx = winCtxs[msg[1]];
        winCtx && (6 === msgType ? readNextScript(worker, winCtx) : 5 === msgType && ((worker, winCtx, instanceId, errorMsg, script) => {
            (script = winCtx.$window$.document.querySelector(`[data-ptid="${instanceId}"]`)) && (errorMsg ? script.dataset.pterror = errorMsg : script.type += "-x");
            readNextScript(worker, winCtx);
        })(worker, winCtx, msg[2], msg[3]));
    }
};

(async sandboxWindow => {
    let worker;
    const mainWindow = sandboxWindow.parent;
    if (await (async (sandboxWindow, _receiveMessage) => {
        console.log("ATOMICS ⚛️", sandboxWindow.location.href);
        return !0;
    })(sandboxWindow)) {
        worker = new Worker("./partytown-ww-atomics.js", {
            name: "Partytown 🎉"
        });
        worker.onmessage = ev => onMessageFromWebWorker(worker, mainWindow, ev.data);
        logMain("Created web worker");
        worker.onerror = ev => console.error("Web Worker Error", ev);
        mainWindow.addEventListener("pt1", (ev => {
            const win = ev.detail;
            const winId = getAndSetInstanceId(win.frameElement);
            registerWindow(worker, winId, win);
        }));
    }
})(window);
