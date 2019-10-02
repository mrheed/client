import * as React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Settings from '@material-ui/icons/Settings';
import ChromeReaderMode from '@material-ui/icons/ChromeReaderMode';
import ImportContacts from '@material-ui/icons/ImportContacts';
import Class from '@material-ui/icons/Class';
import InputIcon from '@material-ui/icons/Input';

export interface NavListItemsInterface {
    button?: Boolean;
    icon: JSX.Element;
    component?: Function;
    name: String;
    path: String;
    exact?: Boolean;
}

export const NavListItems: NavListItemsInterface[] = [
    {
        button: true,
        icon: <DashboardIcon/>,
        name: 'Dashboard',
        path: '/dashboard',
        exact: true
      },
      {
        button: true,
        icon: <Person/>,
        name: 'Siswa',
        path: '/dashboard/siswa',
        exact: true,
      },
      { 
        button: true,
        icon: <PeopleIcon/>,
        name: 'Guru',
        path: '/dashboard/guru',
        exact: true,
      },
      { 
        button: true,
        icon: <InputIcon/>,
        name: 'Input nilai',
        path: '/dashboard/input_nilai',
        exact: true,
      },
      { 
        button: true,
        icon: <InputIcon/>,
        name: 'Daftar nilai',
        path: '/dashboard/daftar_nilai'
      },
      {
        button: true,
        icon: <ChromeReaderMode/>,
        name: 'Mapel',
        path: '/dashboard/mapel',
        exact: true,
      },
      {
        button: true,
        icon: <Class/>,
        name: 'Kelas',
        path: '/dashboard/kelas',
        exact: true,
      },
      {
        button: true,
        icon: <ImportContacts/>,
        name: 'Materi Pelajaran',
        path: '/dashboard/materi_pelajaran',
        exact: true,
      },
      {
        button: true,
        icon: <ImportContacts/>,
        name: 'Ekstrakulikuler',
        path: '/dashboard/ekstrakulikuler',
        exact: true,
      },
      {
        button: true,
        icon: <AssignmentIcon/>,
        name: 'Cetak',
        path: '/dashboard/cetak',
        exact: true,
      },
      {
        button: true,
        icon: <Settings/>,
        name: 'Setting',
        path: '/dashboard/settings',
        exact: true,
      },
]
