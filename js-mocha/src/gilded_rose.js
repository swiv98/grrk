class Item {
    constructor(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
}

// I'd rather move this class/these classes out to a separate file, but we're sticking with 'the convention' of Item

class TypedItem extends Item {

    // these aren't strictly necessary, since where not using the type for the conditions any more
    // nor is setting the type in the subclasses
    static TYPES = {
        NORMAL: 0,
        AGEING_WELL: 1,
        BACKSTAGE_PASS: 2,
        LEGENDARY: 3,
        CONJURED: 4
    };

    constructor(name, sellIn = Infinity, quality = 0, type = TypedItem.TYPES.NORMAL) {
        super(name, sellIn, quality);
        this.type = type;
    }

    update() {
        this.updateSellIn();
        this.updateQuality();
        this.limitQualityBottom();
        this.limitQualityTop();
    }

    updateSellIn() {
        this.sellIn--;
    }

    updateQuality() {
        this.quality--;
    }

    limitQualityBottom() {
        this.quality = Math.max(0, this.quality);
    }

    limitQualityTop() {
        this.quality = Math.min(50, this.quality);
    }
}


class ItemAgeingWell extends TypedItem {
    constructor(name, sellIn, quality) {
        super(name, sellIn, quality, TypedItem.TYPES.AGEING_WELL);
    }

    updateQuality() {
        this.quality++;
    }
}

class ItemBackstagePass extends TypedItem {
    constructor(name, sellIn, quality) {
        super(name, sellIn, quality, TypedItem.TYPES.BACKSTAGE_PASS);
    }

    updateQuality() {
        this.quality++;
        // TODO: implement different increases/settings for different sellIn ranges
    }
}

class ItemLegendary extends TypedItem {
    constructor(name, sellIn, quality) {
        super(name, sellIn, quality, TypedItem.TYPES.LEGENDARY);
    }

    updateSellIn() {
        // noop();
    }

    limitQualityTop() {
        // noop();
    }

}

class ItemConjured extends TypedItem {
    constructor(name, sellIn, quality) {
        super(name, sellIn, quality, TypedItem.TYPES.CONJURED);
    }

    updateQuality() {
        // TODO: refactor into decayRate or something
        super.updateQuality();
        super.updateQuality();
    }
}

class Shop {
    constructor(items = []) {
        this.items = items;
    }

    updateQuality() {
        this.items.forEach(item => item.update());
        return this.items;
    }

    /*
        updateQuality() {
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].name != 'Aged Brie' && this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
                    if (this.items[i].quality > 0) {
                        if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
                            this.items[i].quality = this.items[i].quality - 1;
                        }
                    }
                } else {
                    if (this.items[i].quality < 50) {
                        this.items[i].quality = this.items[i].quality + 1;
                        if (this.items[i].name == 'Backstage passes to a TAFKAL80ETC concert') {
                            if (this.items[i].sellIn < 11) {
                                if (this.items[i].quality < 50) {
                                    this.items[i].quality = this.items[i].quality + 1;
                                }
                            }
                            if (this.items[i].sellIn < 6) {
                                if (this.items[i].quality < 50) {
                                    this.items[i].quality = this.items[i].quality + 1;
                                }
                            }
                        }
                    }
                }
                if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
                    this.items[i].sellIn = this.items[i].sellIn - 1;
                }
                if (this.items[i].sellIn < 0) {
                    if (this.items[i].name != 'Aged Brie') {
                        if (this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
                            if (this.items[i].quality > 0) {
                                if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
                                    this.items[i].quality = this.items[i].quality - 1;
                                }
                            }
                        } else {
                            this.items[i].quality = this.items[i].quality - this.items[i].quality;
                        }
                    } else {
                        if (this.items[i].quality < 50) {
                            this.items[i].quality = this.items[i].quality + 1;
                        }
                    }
                }
            }

            return this.items;
        }
    */
}

class Logger {
    static logShop(shop) {
        shop.items.forEach(Logger.logItem)
    }

    static logItem(item) {
        console.log(`Name: ${item.name.substr(0, 16).padEnd(16, ' ')} | sellIn: ${item.sellIn} | quality: ${item.quality}`);
    }

    static updateShop(updateCount) {
        console.log(`Progressing shop one day (previous update count: ${updateCount})`);
    }
}

module.exports = {
    TypedItem,
    ItemAgeingWell,
    ItemBackstagePass,
    ItemLegendary,
    ItemConjured,
    Shop,
    Logger
};
