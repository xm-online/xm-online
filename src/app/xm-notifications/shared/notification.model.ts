export interface Notification {
    label?: string;
    id?: number;
    typeKey?: string;
    updateDate?: string;
    data?: any;
}

export class NotificationUiConfig {
    constructor(
        public resourceUrl: string, // URL to get all notifications
        public redirectUrl: string, // URL to view all notifications
        public labelPath: string, // path to get the label inside notification object
        public initialState: string, // state when it's new
        public changeStateName: string, // state when it's read
        public changeStateFunction: string, // function name, function to call to mark it as read
        public showAsHtml: boolean, // keep html tags in label
        public showDate: boolean, // show notification date, default false
        public max: number, // max number of notifications in dropdown
        public autoUpdateEnabled: boolean, // whether to auto-check for notifications each N seconds,
                                           // to be rewritten with websockets
        public autoUpdate: number, // auto-update interval in seconds
        public preventNavigation: boolean, // do not navigate to the related entity on click
        public referenceTypeKeyPath: string, // path to get typeKey of related entity inside the notification object,
                                             // used to navigate
        public referenceIdPath: string, // path to get id of related entity inside the notification object,
                                        // used to navigate,
        public privileges: string[], // array of priviledges to show notifications to
    ) {}
}
