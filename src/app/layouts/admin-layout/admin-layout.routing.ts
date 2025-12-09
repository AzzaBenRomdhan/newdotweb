import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { DocumentDetailsComponent } from 'app/documents/document-details/document-details.component';
import { UsersComponent } from 'app/users/users.component';
import { DocumentsComponent } from 'app/documents/documents.component';
import { HistoryComponent } from 'app/history/history.component';
import { EditProfileComponent } from 'app/users/edit-profile/edit-profile.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'documents',      component: DocumentsComponent },
    { path: 'document-Details/:numDocument', component: DocumentDetailsComponent },
    { path: 'history',        component: HistoryComponent },
    { path: 'users',        component: UsersComponent },
    { path: 'edit-profile',        component: EditProfileComponent },

    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
];
