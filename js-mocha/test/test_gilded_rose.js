var {expect} = require('chai');
var {
    Shop,
    TypedItem,
    ItemAgeingWell,
    ItemBackstagePass,
    ItemLegendary,
    ItemConjured,
    Logger
} = require('../src/gilded_rose.js');

class ShopWrapper extends Shop {
    constructor(items) {
        super(items);
        this.updateCount = 0;
        console.log('\n-- new shop instantiated --');
        Logger.logShop(this);
    }

    updateQuality() {
        Logger.updateShop(this.updateCount);
        this.updateCount++;
        let items = super.updateQuality();
        Logger.logShop(this);
        return items;
    }
}

describe('Gilded Rose', function () {

    let gildedRose = {};
    const defaultSellIn = 10;
    const defaultQuality = 5;
    const defaultShopInventory = () => [
        new TypedItem('Just some item', defaultSellIn, defaultQuality),
        new ItemAgeingWell('Aged Brie', defaultSellIn, defaultQuality),
        new ItemBackstagePass('Backstage passes to a TAFKAL80ETC concert', defaultSellIn, defaultQuality),
        new ItemLegendary('Sulfuras, Hand of Ragnaros', defaultSellIn, defaultQuality),
        new ItemConjured('Conjured item - TODO', defaultSellIn, defaultQuality)
    ];

    const shopInventoryAllAtDueDate = () => [
        new TypedItem('Just some item', 0, defaultQuality),
        new ItemAgeingWell('Aged Brie', 0, defaultQuality),
        new ItemBackstagePass('Backstage passes to a TAFKAL80ETC concert', 0, defaultQuality),
        new ItemLegendary('Sulfuras, Hand of Ragnaros', 0, defaultQuality),
        new ItemConjured('Conjured item - TODO', 0, defaultQuality)
    ];

    describe('General item setup', function () {
        beforeEach(function () {
            gildedRose = new ShopWrapper(defaultShopInventory());
        });

        it('NORMAL items should end up in the shop as initialised', function () {
            const items = gildedRose.items;
            expect(items[0].name).to.equal('Just some item');
            expect(items[0].sellIn).to.equal(defaultSellIn);
            expect(items[0].quality).to.equal(defaultQuality);
        });

        it('SPECIAL items should end up in the shop as initialised', function () {
            const items = gildedRose.items;
            expect(items[1].name).to.equal('Aged Brie');
            expect(items[1].sellIn).to.equal(defaultSellIn);
            expect(items[1].quality).to.equal(defaultQuality);
        });

    });

    describe('normal sellIn values', function () {

        describe('NORMAL items', function () {

            beforeEach(function () {
                gildedRose = new ShopWrapper(defaultShopInventory());
            });

            it('sellIn property should decrease after each update', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].sellIn).to.equal(defaultSellIn - 1);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].sellIn).to.equal(defaultSellIn - 2);
            });

            it('should decrease quality by one upon each update', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].quality).to.equal(defaultQuality - 1);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].quality).to.equal(defaultQuality - 2);
            });

            it('should decrease in quality by 1', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].quality).to.equal(defaultQuality - 1);
            });

            it('should never have quality < 0', function () {
                let updatedItems;

                // update quality+1 times to make sure it might dive below 0
                for (let updates = 0; updates < defaultQuality + 1; updates++) {
                    updatedItems = gildedRose.updateQuality();
                }
                expect(updatedItems[0].quality).to.equal(0);
            });

        });

        describe('Aged brie and Backstage pass items', function () {
            beforeEach(function () {
                gildedRose = new ShopWrapper(defaultShopInventory());
            });

            it('increase in quality (some amount)', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[1].sellIn).to.be.above(0);
                expect(updatedItems[1].quality).to.be.above(defaultQuality);
                expect(updatedItems[2].sellIn).to.be.above(0);
                expect(updatedItems[2].quality).to.be.above(defaultQuality);
            });

            it('will not increase in quality beyond 50', function () {
                gildedRose.items[1].quality = 49;
                gildedRose.items[2].quality = 49;
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[1].quality).to.equal(50);
                expect(updatedItems[2].quality).to.equal(50);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[1].quality).to.equal(50);
                expect(updatedItems[2].quality).to.equal(50);
            });
        });

        describe('Aged brie items', function () {
            beforeEach(function () {
                gildedRose = new ShopWrapper(defaultShopInventory());
            });

            it('will increase in quality by 1 when sellIn <= 10 and sellIn >=6', function () {
                gildedRose.items[1].sellIn = 10;
                let updatedItems = gildedRose.updateQuality();
                // 10
                updatedItems = gildedRose.updateQuality();
                // 9
                updatedItems = gildedRose.updateQuality();
                // 8
                updatedItems = gildedRose.updateQuality();
                // 7
                updatedItems = gildedRose.updateQuality();
                // 6
                expect(updatedItems[1].quality).to.equal(defaultQuality + (5 * 1));
            });

            it('will increase in quality by 1 when sellIn <= 5 and sellIn >= 1', function () {
                gildedRose.items[1].sellIn = 5;
                let updatedItems = gildedRose.updateQuality();
                // 5
                updatedItems = gildedRose.updateQuality();
                // 4
                updatedItems = gildedRose.updateQuality();
                // 3
                updatedItems = gildedRose.updateQuality();
                // 2
                updatedItems = gildedRose.updateQuality();
                // 1
                expect(updatedItems[1].quality).to.equal(defaultQuality + (5 * 1));
            })
        });

        describe('Backstage pass items', function () {
            beforeEach(function () {
                gildedRose = new ShopWrapper(defaultShopInventory());
            });

            it('will increase in quality by 2 when sellIn <= 10 and sellIn >=6', function () {
                gildedRose.items[2].sellIn = 10;
                let updatedItems = gildedRose.updateQuality();
                // 10
                updatedItems = gildedRose.updateQuality();
                // 9
                updatedItems = gildedRose.updateQuality();
                // 8
                updatedItems = gildedRose.updateQuality();
                // 7
                updatedItems = gildedRose.updateQuality();
                // 6
                expect(updatedItems[2].quality).to.equal(defaultQuality + (5 * 2));
            });

            it('will increase in quality by 3 when sellIn <= 5 and sellIn >= 1', function () {
                gildedRose.items[2].sellIn = 5;
                let updatedItems = gildedRose.updateQuality();
                // 5
                updatedItems = gildedRose.updateQuality();
                // 4
                updatedItems = gildedRose.updateQuality();
                // 3
                updatedItems = gildedRose.updateQuality();
                // 2
                updatedItems = gildedRose.updateQuality();
                // 1
                expect(updatedItems[2].quality).to.equal(defaultQuality + (5 * 3));
            })
        });

        describe('Legendary items', function () {
            beforeEach(function () {
                gildedRose = new ShopWrapper(defaultShopInventory());
            });

            // Legendary items are been incorrectly implemented (from specs) as well; they just keep whatever your entered them with (and there is no safeguard when instantiating them either)
            it('*have a fixed (their initial) quality', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[3].sellIn).to.be.above(0);
                expect(updatedItems[3].quality).to.equal(defaultQuality);
            });
        });

    });

    describe('sellIn values expiring', function () {

        describe('NORMAL items', function () {

            beforeEach(function () {
                gildedRose = new ShopWrapper(shopInventoryAllAtDueDate());
            });

            it('sellIn property should still decrease after each update', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].sellIn).to.equal(-1);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].sellIn).to.equal(-2);
            });

            it('quality property should decrease twice as fast after each update', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].quality).to.equal(defaultQuality - 2);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[0].quality).to.equal(defaultQuality - 4);
            });
        });

        describe('Aged brie items', function () {

            beforeEach(function () {
                gildedRose = new ShopWrapper(shopInventoryAllAtDueDate());
            });

            // does not match written specs, which, to me, seem to say that the Brie should deteriorate like any regular item after its due date.
            it('*quality property should keep increasing, but slowly (+2) after each update', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[1].quality).to.equal(defaultQuality + 2);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[1].quality).to.equal(defaultQuality + 4);
            });
        });

        describe('Backstage pass items', function () {

            beforeEach(function () {
                gildedRose = new ShopWrapper(shopInventoryAllAtDueDate());
            });

            it('quality property should fall to 0 when sellIn === 0', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[2].quality).to.equal(0);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[2].quality).to.equal(0);
            });
        });

        describe('Legendary items', function () {
            beforeEach(function () {
                gildedRose = new ShopWrapper(shopInventoryAllAtDueDate());
            });

            // unclear from specs whether sellIn should be kept at 0. "Never has to be sold" would mean like 'Infinite' or undefined to me, but not 0...
            it('*have a fixed quality and sellIn when, also when kept beyond sellIn = 0', function () {
                let updatedItems = gildedRose.updateQuality();
                expect(updatedItems[3].sellIn).to.equal(0);
                expect(updatedItems[3].quality).to.equal(defaultQuality);
                updatedItems = gildedRose.updateQuality();
                expect(updatedItems[3].sellIn).to.equal(0);
                expect(updatedItems[3].quality).to.equal(defaultQuality);
            });
        });

    });

});
