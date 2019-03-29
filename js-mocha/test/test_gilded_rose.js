var {expect} = require('chai');
var {Shop, Item} = require('../src/gilded_rose.js');
describe('Gilded Rose', function () {

    let gildedRose = {};
    const defaultSellIn = 5;
    const defaultQuality = 10;
    const defaultShopInventory = [
        new Item('foo', defaultSellIn, defaultQuality),
        new Item('Aged Brie', defaultSellIn, defaultQuality),
        new Item('Backstage passes to a TAFKAL80ETC concert', defaultSellIn, defaultQuality),
        new Item ('Sulfuras, Hand of Ragnaros', defaultSellIn, defaultQuality)
    ];

    describe('General item setup', function() {
        beforeEach(function() {
            gildedRose = new Shop(defaultShopInventory);
        });

        it('unknown items should end up in the shop as initialised', function () {
            const items = gildedRose.items;
            expect(items[0].name).to.equal('foo');
            expect(items[0].sellIn).to.equal(defaultSellIn);
            expect(items[0].quality).to.equal(defaultQuality);
        });

        it('known items should also end up in the shop as initialised', function () {
            const items = gildedRose.items;
            expect(items[1].name).to.equal('Aged Brie');
            expect(items[1].sellIn).to.equal(defaultSellIn);
            expect(items[1].quality).to.equal(defaultQuality);
        });

        it('sellIn property should decrease after each update', function () {
            let updatedItems = gildedRose.updateQuality();
            expect(updatedItems[0].sellIn).to.equal(defaultSellIn - 1);
            updatedItems = gildedRose.updateQuality();
            expect(updatedItems[0].sellIn).to.equal(defaultSellIn - 2);
        });
    });

    describe("General items", function() {

        beforeEach(function() {
            gildedRose = new Shop(defaultShopInventory);
        });

        it("should decrease in quality", function () {
            let updatedItems = gildedRose.updateQuality();
            expect(updatedItems[0].quality).to.be.below(defaultQuality);
        });
    });

    describe("Aged brie items", function() {
        beforeEach(function() {
            gildedRose = new Shop(defaultShopInventory);
        });

        it("increase in quality when sellIn > 0", function () {
            let updatedItems = gildedRose.updateQuality();
            expect(updatedItems[1].sellIn).to.be.above(0);
            expect(updatedItems[1].quality).to.be.above(defaultQuality);
        });
    });


});
