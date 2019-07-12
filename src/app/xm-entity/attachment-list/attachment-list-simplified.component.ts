import {Component} from '@angular/core';
import {AttachmentListBaseComponent} from './attachment-list-base.component';

@Component({
    selector: 'xm-attachment-list-simplified',
    template: `
        <div class="card">
        <div class="card-header card-header-icon card-header-primary">
            <div class="card-icon">
                <i class="material-icons">{{'link'}}</i>
            </div>
            <h4 class="card-title">{{'attachments' | i18nName: principal}}</h4>
        </div>

        <div class="card-body">

            <ng-container *ngIf="attachments">
                <div class="table-responsive sm-overflow">
                    <table class="table table-striped">
                        <thead>
                        <tr >
                            <th *ngFor="let field of fields">
                                <!-- TODO translate -->
                                <span *ngIf="field">{{field | i18nName :principal}}</span>
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr *ngFor="let xmEntity of attachments">
                            <td *ngFor="let field of fields">
                                {{ field == 'startDate' ? (xmEntity[field] | date) : xmEntity[field] }}
                        </tr>
                        </tbody>
                    </table>
                </div>
            </ng-container>

        </div>
    </div>`
})
export class AttachmentListSimplifiedComponent extends AttachmentListBaseComponent {
    public fields = [
        'id', 'typeKey', 'name', 'contentUrl', 'valueContentSize', 'valueContentType', 'startDate'
    ];
}
