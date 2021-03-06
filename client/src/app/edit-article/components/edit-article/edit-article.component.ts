import {Component, OnInit} from '@angular/core'
import {Observable} from 'rxjs'
import {ArticleInputInterface} from '../../../shared/types/article-input.interface'
import {BackendErrorsInterface} from '../../../shared/types/backend-errors.interface'
import {select, Store} from '@ngrx/store'
import {ActivatedRoute} from '@angular/router'
import {
  articleSelector,
  isLoadingSelector,
  isSubmittingSelector,
  validationErrorsSelector,
} from '../../store/selectors'
import {ArticleInterface} from '../../../shared/types/article.interface'
import {filter, map} from 'rxjs/operators'
import {getArticleAction} from '../../store/actions/get-article.action'
import {updateArticleAction} from '../../store/actions/update-article.actions'
import {AppStateInterface} from '../../../shared/types/app-state.interface';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss'],
})
export class EditArticleComponent implements OnInit {
  initialValues$: Observable<ArticleInputInterface>
  isSubmitting$: Observable<boolean>
  isLoading$: Observable<boolean>
  backendErrors$: Observable<BackendErrorsInterface | null>
  slug: string

  constructor(private store: Store<AppStateInterface>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initialValues()
    this.fetchData()
  }

  initialValues(): void {
    this.slug = this.route.snapshot.paramMap.get('slug')
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector))
    this.isLoading$ = this.store.pipe(select(isLoadingSelector))
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector))
    this.initialValues$ = this.store.pipe(
      select(articleSelector),
      filter(Boolean),
      map((article: ArticleInterface) => {
        return {
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
        }
      })
    )
  }

  fetchData(): void {
    this.store.dispatch(getArticleAction({slug: this.slug}))
  }

  onSubmit(articleInput: ArticleInputInterface): void {
    this.store.dispatch(updateArticleAction({articleInput, slug: this.slug}))
  }
}
