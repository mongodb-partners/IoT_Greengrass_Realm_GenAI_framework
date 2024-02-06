import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import InventoryIcon from '@mui/icons-material/Inventory';
import EngineeringIcon from '@mui/icons-material/Engineering';

const icons = {
  DirectionsCarIcon: DirectionsCarIcon,
  InventoryIcon: InventoryIcon,
  EngineeringIcon: EngineeringIcon
};

export default {
  items: [
    {
      type: 'group',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'jobs',
          title: 'Jobs',
          type: 'item',
          url: '/jobs',
          icon: icons['EngineeringIcon']
        },
        {
          id: 'parts',
          title: 'Parts',
          type: 'item',
          url: '/parts',
          icon: icons['InventoryIcon']
        },
        {
          id: 'vehicles',
          title: 'Vehicles',
          type: 'item',
          url: '/vehicles',
          icon: icons['DirectionsCarIcon']
        }
      ]
    }
  ]
};
