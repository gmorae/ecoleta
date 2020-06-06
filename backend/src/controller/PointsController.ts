import { Request, Response } from "express";
import knex from "../database/connection";

const url = "http://192.168.0.6:3333";

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => +item.trim());

    const points = await knex("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    const serializedPoints = points.map((point) => {
      return {
        id: point.id,
        name: point.title,
        image: `${url}/uploads/${point.image}`,
      };
    });

    //select points.* from `points` inner join `point_items` on `points`.`id` = `point_item`.`point_id` where `point_item`.`item_id` = ${id}

    return res.json(serializedPoints);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex("points").where("id", id).first();

    if (!point) {
      return res.send(400);
    }

    const items = await knex("items")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id)
      .select("items.title");

      const serializedPoint = {
        ...point,
        image_url: `${url}/uploads/${point.image}`
      }

    //select * from `items` inner join `point_items` on `items`.`id` = `point_item`.`item_id` where `point_item`.`point_id` = '1'

    return res.json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx("POINTS").insert(point);

    const point_id = insertedIds[0];

    const pointItems = items
      .split(",")
      .map((item: string) => +item.trim())
      .map((item_id: number) => {
        return {
          item_id,
          point_id,
        };
      });

    await trx("POINT_ITEMS").insert(pointItems);

    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }
}

export default PointsController;
