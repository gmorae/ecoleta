import { Request, Response } from "express";
import knex from "../database/connection";

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex("items").select("*");
    const url = "http://192.168.0.6:3333";
    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        name: item.title,
        image: `${url}/uploads/${item.image}`,
      };
    });

    return res.json(serializedItems);
  }
}

export default ItemsController;
