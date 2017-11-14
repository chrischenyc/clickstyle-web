import Bookings from '../../api/bookings/bookings';
import Products from '../../api/products/products';
import Services from '../../api/services/services';
import Addons from '../../api/addons/addons';

// TODO: remove sample data
if (Bookings.find().count() === 0) {
  Bookings.insert({
    title: 'wedding makeup artist needed',
    location: 'South Yarra, VIC',
    summary:
      'Exercitationem quos repudiandae. Voluptatem sit sed minus quia non aut hic. Consequuntur commodi et voluptatem ratione cum sunt iusto ut. Architecto quidem facilis voluptatum.',
  });

  Bookings.insert({
    title: 'hair stylist needed - URGENT!',
    location: 'Gold Coast, QLD',
    summary:
      'Officia sunt perferendis sunt doloremque non. Totam enim nemo vitae nisi exercitationem nihil fugit ratione. Similique aut voluptas qui rerum mollitia asperiores. Eius maiores quia beatae earum blanditiis libero dolores minus.',
  });

  Bookings.insert({
    title: 'makeup artist needed',
    location: 'Doncaster, VIC',
    summary: 'Distinctio nemo facere voluptatem. Qui architecto non qui molestias. Id impedit at.',
  });

  Bookings.insert({
    title: 'I need my hair done ASAP',
    location: 'Perth, WA',
    summary:
      'Eligendi et dignissimos perspiciatis doloremque asperiores iste exercitationem et amet. Aliquid consequatur sed numquam temporibus libero quas. Ut dolore nostrum adipisci rerum temporibus rerum.',
  });

  Bookings.insert({
    title: 'makeup needed',
    location: 'Chatswood, NSW',
    summary:
      'Labore est quo quaerat numquam voluptatum. Libero est aut voluptate. Quae earum numquam. Quam tempora eum vel. Id excepturi rem autem tempore sint voluptas qui est. Beatae similique nihil ratione corporis in ut dolorum.',
  });
}

// seed Products data
if (Products.find().count() === 0) {
  const brands = [
    "L'Oréal",
    'Pantene',
    'Nivea',
    'Lancôme',
    'Avon',
    'Dove',
    'Olay',
    'Estée Lauder',
    'Head & Shoulders',
    'Christian Dior',
    'Chanel',
    'Aveeno',
    'Garnier',
    'Schwarzkopf',
    'Maybelline',
    'Clarins',
    'Shiseido',
    'Clean & Clear',
    'Neutrogena',
    'Natura',
    "L'Occitane",
    "Johnson's",
    'Lux',
    'M.A.C.',
    'Kérastase',
    'Redken',
    'Rexona',
    'Biotherm',
    'Vichy',
    'Oriflame',
    'Matrix',
    'Clearasil',
    'Rimmel',
    'Yves Saint Laurent',
    'The Body Shop',
    'Pola Orbis',
    'Sunsilk',
    'Clinique',
    'Softsoap',
    'Biore',
    'Irish Spring',
    'Coty',
    'Revlon',
    'Elizabeth Arden',
    'Eucerin',
    'RoC',
    'La Roche-Posay',
    'KOSÉ',
    "Kiehl's",
    'Speed Stick',
  ];
  brands.forEach((brand) => {
    Products.insert({
      name: brand,
      system: true,
    });
  });
}

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

  services.forEach((service) => {
    const serviceId = Services.insert({
      name: service.name,
    });

    service.addons.forEach((addon) => {
      Addons.insert({
        serviceId,
        name: addon,
        createdBy: 'system',
        public: true,
      });
    });
  });
}

Addons.find()
  .fetch()
  .forEach((addon) => {
    Addons.update({ _id: addon._id }, { $set: { public: true } });
  });
