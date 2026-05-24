import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, finalize } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'forgot-password.component.html', standalone: false })
export class ForgotPasswordComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    error = ''; // 🌟 FIXED: Added property to capture backend errors locally for *ngIf="error"

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef // 🌟 Added to guarantee UI updates when state changes
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.error = ''; // Clear old errors on a fresh click
        this.alertService.clear();
    
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
    
        this.loading = true;
        this.cdr.detectChanges();

        this.accountService.forgotPassword(this.f.email.value)
            .pipe(
                first(),
                finalize(() => {
                    this.loading = false; // 🌟 Forces spinner off no matter what
                    this.cdr.detectChanges();
                })
            )
            .subscribe({
                next: () => {
                    this.alertService.success('Please check your email for password reset instructions');
                },
                error: error => {
                    setTimeout(() => {
                        // 🌟 FIXED: Store the error string so your template error banner reveals itself!
                        this.error = error; 
                        this.cdr.detectChanges();
                    });
                }
            });
    }
}