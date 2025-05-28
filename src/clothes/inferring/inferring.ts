import { ClothesKind } from "@prisma/client";

export class Inferring {
    public tempInterring(kind: ClothesKind): {tempFloor: number, tempRoof: number} {
        if (kind == String(ClothesKind.TShirt)) {
            return {tempFloor: 20, tempRoof: 30};
        }
        return {tempFloor: 20, tempRoof: 30};
    }
}