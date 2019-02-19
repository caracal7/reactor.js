import getArguments from 'es-arguments';

const Reactive = function() {
    const state = {};
    const functions = {};
    const edges = {};

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
        let dependencies = getArguments(func);
        dependencies.forEach(input => {
            (edges[input] = edges[input] || []).push(property);
        });
        functions[property] = () => {
            const arg = allDefined(dependencies);
            if (arg) state[property] = func(...arg);
        };
    }

    function Apply(command) {
        if (command === 'debug') {
            console.log('state', state);
            console.log('edges', edges);
            console.log('functions', functions);
        }
    }

    return new Proxy(Apply, {
        get: (target, name) => name in state ? state[name] : "Key '"+name+"' does't exist",
        set: (target, property, value, receiver) => {
            if (typeof value === 'function') setFn(property, value);
            else setValue(property, value);
        },
        apply: (target, thisArg, argumentsList) => target(...argumentsList),
        deleteProperty: function(target, property) {
            console.log('Not implemented')
        }
    });
};

export default Reactive;
