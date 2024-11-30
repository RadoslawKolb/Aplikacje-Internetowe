<?php
/** @var $product ?\App\Model\Product */
?>

<div class="form-group">
    <label for="name">Nazwa Produktu</label>
    <input type="text" id="name" name="product[name]" value="<?= $product ? $product->getName() : '' ?>">
</div>

<?php if (method_exists($product, 'getDescription')): ?>
    <div class="form-group">
        <label for="description">Opis</label>
        <textarea id="description" name="product[description]"><?= $product ? $product->getDescription() : '' ?></textarea>
    </div>
<?php endif; ?>

<div class="form-group">
    <label for="price">Cena</label>
    <input type="text" id="price" name="product[price]" value="<?= $product ? $product->getPrice() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Zatwierdź">
</div>