import Services from '../../../api/services/services';
import Addons from '../../../api/addons/addons';

// seed Services and Addons data
if (Services.find().count() === 0) {
  const services = [
    {
      name: 'Make-Up',
      addons: [
        'Full Face Makeup',
        'Full Face Makeup with Glitter',
        'Full Face Makeup with Lashes',
        'Airbrush Makeup',
        'Special Effects Makeup',
        'Prom Makeup',
      ],
    },
    {
      name: 'Hair - Women',
      addons: [
        'Cut & Style',
        'Updo',
        'Shampoo & Style',
        'Braids',
        'Full Hair Color',
        'Color Retouch',
        'Full Highlights',
        'Partial Highlights',
        'Permanent Hair Treatment',
        'Roller Set',
        'Silk Press',
        'Blowout',
        'Hair Extension',
        'Keratin Treatment',
        'Styling',
        'Blowout with Iron',
        'Curling',
      ],
    },
    {
      name: 'Hair - Men',
      addons: [
        'Beard Trim',
        'Haircut',
        'Hot Towel Massage',
        'Bald Head',
        'Cut & Side design',
        'Hair Coloring',
        'Braids',
      ],
    },
    { name: 'Hair - Children', addons: ['Hair Cut', 'Cut & Side Design', 'Braids'] },
    {
      name: 'Wedding',
      addons: [
        'Bridal Makeup',
        'Bridal Wedding Package',
        'Bridal Makeup & Hair Styling',
        'Bridal Hair Styling',
        'Bridesmaid Hair Styling',
        'Bridesmaid Makeup',
        'Bridal Trials',
      ],
    },
    {
      name: 'Nails',
      addons: [
        'Full Set Acrylic',
        'Refill Acrylic Nails',
        'Gel Manicure',
        'Pedicure',
        'Nail Art',
        'Spa Pedicure',
      ],
    },
    {
      name: 'Eyebrow',
      addons: ['Threading', 'Tinting', 'Men’s Eyebrow Threading', 'Eyebrow Shaping', 'Waxing'],
    },
    { name: 'Eyelash', addons: ['Lashes', 'Bottom Lashes', 'Mink Lashes', 'Eyelash Extension'] },
    {
      name: 'Massage & Spa - Women',
      addons: [
        '30min Massage',
        '60min Massage',
        '90min Massage',
        'Foot Massage',
        'Hot Stone Massage',
        'Aromatherapy Massage',
        'Remedial Massage',
        'Prenatal Massage',
      ],
    },
    {
      name: 'Massage & Spa - Men',
      addons: [
        '30min Massage',
        '60min Massage',
        '90min Massage',
        'Foot Massage',
        'Hot Stone Massage',
        'Aromatherapy Massage',
        'Remedial Massage',
      ],
    },
    { name: 'Tanning', addons: ['Full Body Airbrush Tan', 'Half Body Airbrush Tan'] },
    {
      name: 'Waxing',
      addons: [
        'Brazilian',
        'Bikini Line',
        'Full Arm Wax',
        'Full Leg Wax',
        'Full Face Wax',
        'Half Arm Wax',
        'Half Leg Wax',
        'Underarm Wax',
      ],
    },
    { name: 'Skincare treatment', addons: ['Facial', 'Acne Facial'] },
  ];

  for (let index = 0; index < services.length; index++) {
    const service = services[index];

    const serviceId = Services.insert({
      name: service.name,
      displayOrder: index,
    });

    service.addons.forEach((addon) => {
      Addons.insert({
        serviceId,
        name: addon,
        createdBy: 'system',
        public: true,
      });
    });
  }
}
