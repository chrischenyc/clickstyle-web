import Bookings from '../../api/bookings/bookings';

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
