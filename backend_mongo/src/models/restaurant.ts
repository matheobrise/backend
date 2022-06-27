import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import IRestaurant from '../interfaces/restaurant';

const RestaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    idRestaurateur: { type: Number, required: true },
    articles: { type: [Schema.Types.ObjectId], required: false },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

RestaurantSchema.post<IRestaurant>('save', function () {
  logging.info('Mongo', 'Checkout the restaurant we just saved: ', this);
});

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
