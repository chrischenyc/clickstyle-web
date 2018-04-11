export const calculateTotal = (services) => {
  let total = 0;

  services.forEach((service) => {
    total += service.basePrice;

    service.addons.forEach((addon) => {
      total += addon.price;
    });
  });

  return total;
};

export const calculateCount = (services) => {
  let count = 0;

  services.forEach((service) => {
    count += 1;

    service.addons.forEach(() => {
      count += 1;
    });
  });

  return count;
};

export const calculateTotalDuration = (services) => {
  let total = 0;

  services.forEach((service) => {
    total += service.baseDuration;

    service.addons.forEach((addon) => {
      total += addon.duration;
    });
  });

  return total;
};
