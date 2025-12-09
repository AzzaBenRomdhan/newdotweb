import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DocumentsComponent } from 'app/documents/documents.component';
import { DocumentDetailsComponent } from 'app/documents/document-details/document-details.component';
import { UsersComponent } from 'app/users/users.component';
import { AddUserDialogComponent } from 'app/users/add-user-dialog/add-user-dialog.component';
import { ConfirmDialogComponent } from 'app/shared/confirm-dialog/confirm-dialog.component';
import { HistoryComponent } from 'app/history/history.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MagnifierComponent } from 'app/magnifier/magnifier.component';
import { EditProfileComponent } from 'app/users/edit-profile/edit-profile.component';
import { EditUserComponent } from 'app/users/edit-user/edit-user.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatChipsModule,
    NgChartsModule,
NgApexchartsModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    DocumentsComponent,
    DocumentDetailsComponent,
    UsersComponent,
    AddUserDialogComponent,
    ConfirmDialogComponent,
    HistoryComponent,
    MagnifierComponent,
    EditProfileComponent,
    EditUserComponent
    
  ]
})

export class AdminLayoutModule {}
