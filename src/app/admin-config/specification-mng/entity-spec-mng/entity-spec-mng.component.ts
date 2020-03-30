import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StatesManagementDialogComponent } from '@xm-ngx/entity/states-management-dialog';
import { ConfigVisualizerDialogComponent } from '../config-visualizer-dialog/config-visualizer-dialog.component';
import { XmConfigService } from '../../../shared/spec/config.service';

import { ConfigValidatorUtil } from '../config-validator/config-validator.util';

@Component({
    selector: 'xm-entity-spec-mng',
    templateUrl: './entity-spec-mng.component.html',
    styleUrls: ['./entity-spec-mng.component.scss'],
})
export class EntitySpecMngComponent implements OnInit {

    public entityValidation: any;
    public isXmEntitySpecValid: boolean;
    public entitySpecificationIn: string;
    public entitySpecificationOut: string;
    public line: number;
    public aceEditorOptions: any = {
        highlightActiveLine: true,
        maxLines: 50,
    };

    constructor(
        private modalService: MatDialog,
        private service: XmConfigService,
    ) {
    }

    public ngOnInit(): void {
        this.service.getConfig('/entity/xmentityspec.yml').subscribe((result) => {
            this.entitySpecificationIn = result;
            this.entitySpecificationOut = result;
        });
    }

    public onEntitySpecificationChange(textChanged: string): void {
        this.isXmEntitySpecValid = false;
        this.entityValidation = null;
        this.entitySpecificationOut = textChanged;
    }

    public validateXmEntitySpec(): void {
        const errors = ConfigValidatorUtil.validate(this.entitySpecificationOut);
        if (errors && errors.length) {
            this.entityValidation = {errorMessage: ''};
            for (const err of errors) {
                this.entityValidation.errorMessage += err.message + (err.path ? ` path: ${err.path}` : '') + '<br/>';
                if (err.line) {
                    this.line = err.line;
                }
            }
        } else {
            this.isXmEntitySpecValid = true;
        }
    }

    public onShowConfigVisualizerDialog(): void {
        const modalRef = this.modalService
            .open(ConfigVisualizerDialogComponent,
                {width: '80vw'});
        modalRef.componentInstance.entitySpecification = this.entitySpecificationOut;
    }

    public onShowConfigStatesManagementDialog(): void {
        this.modalService.open(StatesManagementDialogComponent, {width: '500px'});
    }


    public updateEntityConfig(): void {
        this.service.updateXmEntitySpec(this.entitySpecificationOut).subscribe(() => {
            window.location.reload();
        });
    }

}
