import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
interface Cuisine {
  state: string;
  dishes: string[];
  region: string;
  isPopular?: boolean;
}
 
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(private router: Router) {}
 
  searchTerm: string = '';
  selectedState: string | null = null;
  activeSubmenu: string | null = null;
 
  regions: string[] = [
    'Northern India',
    'Central India',
    'Western India',
    'Eastern India',
    'Northeastern India',
    'Southern India'
  ];
 
  statesByRegion: Record<string, string[]> = {
    'Northern India': [
      'Jammu & Kashmir', 'Ladakh', 'Himachal Pradesh', 'Punjab', 'Haryana',
      'Uttarakhand', 'Rajasthan', 'Delhi', 'Uttar Pradesh'
    ],
    'Central India': ['Madhya Pradesh', 'Chhattisgarh'],
    'Western India': ['Gujarat', 'Maharashtra', 'Goa'],
    'Eastern India': ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
    'Northeastern India': [
      'Arunachal Pradesh', 'Assam', 'Manipur', 'Meghalaya',
      'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'
    ],
    'Southern India': [
      'Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana'
    ]
  };
 
  cuisines: Cuisine[] = [
    // Northern India
    {
      state: 'Jammu & Kashmir',
      dishes: ['Rogan Josh', 'Yakhni', 'Dum Aloo', 'Modur Pulao', 'Kashmiri Kahwa'],
      region: 'Northern India',
      isPopular: true
    },
    {
      state: 'Himachal Pradesh',
      dishes: ['Dham', 'Sidu', 'Chana Madra', 'Babru', 'Aktori'],
      region: 'Northern India'
    },
    {
      state: 'Punjab',
      dishes: ['Sarson ka Saag', 'Makki di Roti', 'Butter Chicken', 'Amritsari Kulcha', 'Lassi'],
      region: 'Northern India',
      isPopular: true
    },
    {
      state: 'Haryana',
      dishes: ['Kachri ki Sabzi', 'Besan Masala Roti', 'Mithe Chawal', 'Bajra Khichdi'],
      region: 'Northern India'
    },
    {
      state: 'Uttarakhand',
      dishes: ['Kafuli', 'Phaanu', 'Baadi', 'Chainsoo', 'Jhangore ki Kheer'],
      region: 'Northern India'
    },
    {
      state: 'Rajasthan',
      dishes: ['Dal Baati Churma', 'Gatte ki Sabzi', 'Ker Sangri', 'Laal Maas'],
      region: 'Northern India',
      isPopular: true
    },
    {
      state: 'Delhi',
      dishes: ['Chole Bhature', 'Butter Chicken', 'Parathas', 'Nihari', 'Aloo Tikki'],
      region: 'Northern India',
      isPopular: true
    },
    {
      state: 'Uttar Pradesh',
      dishes: ['Kachori', 'Petha', 'Lucknawi Biryani', 'Tundey Kebab', 'Galouti Kebab', 'Sheermal'],
      region: 'Northern India',
      isPopular: true
    },
    {
      state: 'Ladakh',
      dishes: ['Thukpa', 'Momos', 'Skyu', 'Butter Tea'],
      region: 'Northern India'
    },
 
    // Central India
    {
      state: 'Madhya Pradesh',
      dishes: ['Poha Jalebi', 'Bhutte ka Kees', 'Dal Bafla', 'Indori Sev', 'Mawa Bati'],
      region: 'Central India'
    },
    {
      state: 'Chhattisgarh',
      dishes: ['Chila', 'Faraa', 'Bhajia', 'Red Ant Chutney', 'Dehrori'],
      region: 'Central India'
    },
 
    // Western India
    {
      state: 'Gujarat',
      dishes: ['Dhokla', 'Thepla', 'Khandvi', 'Undhiyu', 'Fafda-Jalebi'],
      region: 'Western India',
      isPopular: true
    },
    {
      state: 'Maharashtra',
      dishes: ['Pav Bhaji', 'Puran Poli', 'Vada Pav', 'Misal Pav', 'Modak'],
      region: 'Western India',
      isPopular: true
    },
    {
      state: 'Goa',
      dishes: ['Goan Fish Curry', 'Vindaloo', 'Bebinca', 'Sorpotel', 'Prawn Balchao'],
      region: 'Western India',
      isPopular: true
    },
 
    // Eastern India
    {
      state: 'West Bengal',
      dishes: ['Shorshe Ilish', 'Kosha Mangsho', 'Sandesh', 'Rasgulla', 'Mishti Doi'],
      region: 'Eastern India',
      isPopular: true
    },
    {
      state: 'Odisha',
      dishes: ['Pakhala Bhata', 'Dalma', 'Chhena Poda', 'Rasabali', 'Poda Pitha'],
      region: 'Eastern India'
    },
    {
      state: 'Bihar',
      dishes: ['Litti Chokha', 'Sattu Paratha', 'Thekua', 'Dal Pitha'],
      region: 'Eastern India'
    },
    {
      state: 'Jharkhand',
      dishes: ['Dhuska', 'Thekua', 'Rugra', 'Chilka Roti'],
      region: 'Eastern India'
    },
 
    // Northeastern India
    {
      state: 'Assam',
      dishes: ['Assam Laksa', 'Duck Curry', 'Pitha', 'Masor Tenga'],
      region: 'Northeastern India'
    },
    {
      state: 'Arunachal Pradesh',
      dishes: ['Thukpa', 'Zan', 'Apong', 'Bamboo Shoot Fry'],
      region: 'Northeastern India'
    },
    {
      state: 'Manipur',
      dishes: ['Eromba', 'Chamthong', 'Singju', 'Kangshoi'],
      region: 'Northeastern India'
    },
    {
      state: 'Meghalaya',
      dishes: ['Jadoh', 'Dohneiiong', 'Nakham Bitchi', 'Pumaloi'],
      region: 'Northeastern India'
    },
    {
      state: 'Mizoram',
      dishes: ['Bamboo Shoot Fry', 'Bai', 'Sawhchiar'],
      region: 'Northeastern India'
    },
    {
      state: 'Nagaland',
      dishes: ['Smoked Pork', 'Bamboo Steamed Fish', 'Axone', 'Zutho'],
      region: 'Northeastern India'
    },
    {
      state: 'Tripura',
      dishes: ['Mui Borok', 'Chakhwi', 'Wahan Mosdeng', 'Berma'],
      region: 'Northeastern India'
    },
    {
      state: 'Sikkim',
      dishes: ['Thukpa', 'Momos', 'Gundruk', 'Kinema'],
      region: 'Northeastern India'
    },
 
    // Southern India
    {
      state: 'Andhra Pradesh',
      dishes: ['Hyderabadi Biryani', 'Gongura Pachadi', 'Pesarattu', 'Pulihora'],
      region: 'Southern India',
      isPopular: true
    },
    {
      state: 'Karnataka',
      dishes: ['Bisi Bele Bath', 'Mysore Pak', 'Ragi Mudde', 'Neer Dosa', 'Dharwad Peda'],
      region: 'Southern India',
      isPopular: true
    },
    {
      state: 'Kerala',
      dishes: ['Appam', 'Puttu', 'Sambar', 'Malabar Parotta', 'Fish Moilee'],
      region: 'Southern India',
      isPopular: true
    },
    {
      state: 'Tamil Nadu',
      dishes: ['Idli', 'Dosa', 'Sambar', 'Pongal', 'Chettinad Chicken'],
      region: 'Southern India',
      isPopular: true
    },
    {
      state: 'Telangana',
      dishes: ['Hyderabadi Biryani', 'Sarva Pindi', 'Pachi Pulusu'],
      region: 'Southern India',
      isPopular: true
    }
  ];
  popularCuisines = this.cuisines.filter(c => c.isPopular);
 
  toggleSubmenu(region: string) {
    this.activeSubmenu = this.activeSubmenu === region ? null : region;
  }
 
  selectState(state: string) {
    this.selectedState = state;
  }
 
  getDishes(state: string): string[] {
    const cuisine = this.cuisines.find(c => c.state === state);
    if (!cuisine) {
      console.warn(`No dishes found for state: ${state}`);
      return ['Coming soon...'];
    }
    return cuisine.dishes;
  }
 
  getFilteredStates(region: string): string[] {
    const allStates = this.statesByRegion[region] || [];
    if (!this.searchTerm.trim()) return allStates;
 
    return allStates.filter(state =>
      state.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
 
  clearSearch() {
    this.searchTerm = '';
  }
 
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
 
  trackByRegion(index: number, region: string): string {
    return region;
  }
 
  trackByState(index: number, cuisine: Cuisine): string {
    return cuisine.state;
  }
 
  trackByName(index: number, state: string): string {
    return state;
  }
 
  isStatePopular(state: string): boolean {
    return this.cuisines.find(c => c.state === state)?.isPopular || false;
  }
 
  getRegionByState(state: string): string | undefined {
    return this.cuisines.find(c => c.state === state)?.region;
  }
 
  isGlobalSearchEmpty(): boolean {
    return this.searchTerm.trim() !== '' &&
      this.regions.every(region => this.getFilteredStates(region).length === 0);
  }
}
