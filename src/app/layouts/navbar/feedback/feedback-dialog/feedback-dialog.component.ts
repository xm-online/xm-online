import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { IFeedbackRequest } from '../feedback.service';

const TRANSLATES = {
    feedback: {en: 'Feedback', ru: 'Обратная связь', uk: 'Відгуки'},
    title: {en: 'Topic', ru: 'Тема', uk: 'Тема'},
    send: {en: 'Send', ru: 'Отправить', uk: 'Надіслати'},
    cancel: {en: 'Cancel', ru: 'Отмена', uk: 'Скасувати'},
    description: {en: 'Description', ru: 'Описание', uk: 'Опис'},
    feedbackDetails: {
        en: 'Send your review - we are sure it will make our product better!',
        ru: 'Отправь свой отзыв - уверены, он сделает наш продукт лучше!',
        uk: 'Відправ свій відгук - впевнені, він зробить наш продукт краще!'},
};

@Component({
    selector: 'xm-feedback-dialog',
    templateUrl: './feedback-dialog.component.html',
    styleUrls: ['./feedback-dialog.component.scss'],
})
export class FeedbackDialogComponent {

    public TRS: typeof TRANSLATES = TRANSLATES;

    public data: IFeedbackRequest = {
        topic: '',
        message: '',
    };

    constructor(public dialogRef: MatDialogRef<FeedbackDialogComponent>) {}

    public submit(): void {
        this.dialogRef.close(this.data);
    }

}
