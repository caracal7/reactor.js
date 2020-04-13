/******************************************************************************/
// The MIT Licence (MIT)
// Copyright (C) 2019 Dmitry Vasilev
// This file is part of reactive.js
/******************************************************************************/

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

const Arguments = func => {
    const str = func.toString().replace(STRIP_COMMENTS, '');
    const args = str.split('=>',1)[0].trim();
    return args.charAt(0) == '(' && args[args.length - 1] == ')'
        ? args.substr(1, args.length - 2).match(ARGUMENT_NAMES)
        : [args];
}

const Reactive = function() {
    const state = {};
    const functions = {};
    const edges = {};
    const args = {};
    const scripts = {};

    const invoke = property => {
        functions[property]();
    };

    const depthFirstSearch = property => {
        const visited = {};
        const nodeList = [];

        const search = node => {
            if (!visited[node]) {
                visit(node);
                nodeList.push(node);
            }
        };

        const visit = node => {
            visited[node] = true;
            edges[node] && edges[node].forEach(search);
        }

        visit(property);

        return nodeList;
    }

    const setValue = (property, value) => {
        if (state[property] !== value) {
            state[property] = value;
            depthFirstSearch(property).reverse().forEach(invoke);
        };
    }

    const allDefined = dependencies => {
        const args = [];
        return dependencies.every(property => {
            if (state[property] !== undefined) {
                args.push(state[property]);
                return true;
            }
        }) ? args : undefined;
    };

    const setFn = (property, func) => {
        scripts[property] = func;
        args[property] = Arguments(func)
        args[property].forEach(input => {
            (edges[input] = edges[input] || []).push(property);
        });
        functions[property] = () => {
            const a = allDefined(args[property]);
            if (a) state[property] = func(...a);
        };
    }

    function Apply(command) {
        if (command === 'debug') {
            return {
                functions,
                state,
                edges,
                args,
                scripts
            }
        }
    }

    return new Proxy(Apply, {
        get: (target, name) => name in state ? state[name] : `Key "${name}" does't exist`,
        set: (target, property, value, receiver) => {
            if (typeof value === 'function') setFn(property, value);
            else setValue(property, value);
            return true;
        },
        apply: (target, thisArg, argumentsList) => target(...argumentsList),
        deleteProperty: function(target, property) {
            console.log('Not implemented')
        }
    });
};

module.exports = Reactive;
