import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AppStateInterface} from '../../../shared/types/app-state.interface';
import {CurrentUserInterface} from '../../../shared/types/current-user.interface';
import {Observable, Subscription} from 'rxjs';
import {currentUserSelector} from '../../../auth/store/selectors';
import {filter} from 'rxjs/operators';
import {BackendErrorsInterface} from '../../../shared/types/backend-errors.interface';
import {isSubmittingSelector, validationErrorsSelector} from '../../store/selectors';
import {CurrentUserInputInterface} from '../../../shared/types/current-user-input.interface';
import {updateCurrentUserAction} from '../../../auth/store/actions/update-current-user.action';
import {logoutAction} from '../../../auth/store/actions/sync.action';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  form: FormGroup
  currentUser: CurrentUserInterface
  currentUserSubscription: Subscription
  isSubmitting$: Observable<boolean>
  backendErrors$: Observable<BackendErrorsInterface | null>

  constructor(private fb: FormBuilder, private store: Store<AppStateInterface>) { }

  ngOnInit(): void {
    this.initializeValues()
    this.initializeListeners()
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe()
  }

  initializeValues(): void {
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector))
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector))
  }

  initializeListeners(): void {
    this.currentUserSubscription = this.store.pipe(
      select(currentUserSelector),
      filter(Boolean)
    ).subscribe((currentUser: CurrentUserInterface) => {
      this.currentUser = currentUser
      this.initializeForm()
    })
  }

  initializeForm(): void {
    this.form = this.fb.group({
      image: this.currentUser.image,
      username: this.currentUser.username,
      bio: this.currentUser.bio,
      email: this.currentUser.email,
      password: ''
    })
  }

  submit(): void {
    const currentUserInput: CurrentUserInputInterface = {
      ...this.currentUser,
      ...this.form.value
    }
    this.store.dispatch(updateCurrentUserAction({currentUserInput}))
  }

  logout(): void {
    this.store.dispatch(logoutAction())
  }
}
