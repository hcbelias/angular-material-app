"use strict";

import mongoose from "mongoose";

var ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: "Campo Nome é obrigatório" },
    item: {
      type: mongoose.Schema.ObjectId,
      ref: "Item",
      required: "Campo Item é obrigatório"
    },
    provider: {
      type: mongoose.Schema.ObjectId,
      ref: "Provider",
      required: "Campo Fornecedor é obrigatório"
    },
    active: {
      type: Boolean,
      required: "Campo Ativo é obrigatório",
      default: true
    },
    imgGoogleId: { type: String, default: "1Fe0G4g_u72sTVW6Ph6_invGG4SlyvbXW" }, // https://drive.google.com/open?id=1Gss2WbxN8bWZ0HLaaDrLuiRTBgnAm6Cg
    type: String,
    abv: Number,
    ibu: Number
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
);

ProductSchema.virtual("imgGooglePath").get(function() {
  return `https://docs.google.com/uc?id=${this.imgGoogleId ||"1Fe0G4g_u72sTVW6Ph6_invGG4SlyvbXW"}`;
});

ProductSchema.pre("save", function(next) {
  const querystring = this.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/a/gi, "[aáäãâà]")
    .replace(/á/gi, "a")
    .replace(/ã/gi, "a")
    .replace(/e/gi, "[eéëèê]")
    .replace(/i/gi, "[iíïìî]")
    .replace(/o/gi, "[oóöõôò]")
    .replace(/u/gi, "[uúüùû]");

  const queryName = {
    $regex: `.*${querystring}.*`,
    $options: "i"
  };
  this.constructor.find(
    { name: queryName, provider: this.provider, _id: { $ne: this.id } },
    (err, data) => {
      if (err) {
        return next(err);
      }
      if (data && data.length > 0) {
        let error = new Error(
          `Já existe um produto com este nome para o mesmo fornecedor.`
        );
        next(error);
      } else {
        return next();
      }
    }
  );
});

export default ProductSchema;
