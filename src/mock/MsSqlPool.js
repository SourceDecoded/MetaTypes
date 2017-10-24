

export default class {
    request() {
        return {
            query: (q) => {
                this.query = q;
                return Promise.resolve([]);
            }
        };
    }

    asPromise() {
        return Promise.resolve({
            request: this.request
        });
    }
}