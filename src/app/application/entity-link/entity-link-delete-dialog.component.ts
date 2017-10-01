import {Component} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {LinkService} from "../../entities/link/link.service";
import {Link} from "../../entities/link/link.model";

@Component({
    selector: 'xm-link-delete-dialog',
    templateUrl: './entity-link-delete-dialog.component.html'
})
export class EntityLinkDeleteDialogComponent {

    entityLink: Link;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private linkService: LinkService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.addLocation('link');
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.linkService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'linkListModification',
                content: 'Deleted an link'
            });
            this.activeModal.dismiss(true);
        });
    }
}
