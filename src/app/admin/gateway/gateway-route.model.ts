export class GatewayRoute {
    constructor(
        public path: string,
        public serviceId: string,
        public serviceInstances: any[],
        public serviceInstancesStatus: any,
        public serviceMetadata: any
    ) { }
}
