using Catalog.API.Data;
using Catalog.API.Entities;
using MongoDB.Driver;


namespace Catalog.API.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ICatalogContext _context;
    public ProductRepository(ICatalogContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task Create(Product product)
    {
        await _context.Products.InsertOneAsync(product);
    }

    public async Task<bool> Delete(string id)
    {
        FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(p => p.Id, id);
        DeleteResult deleteResult = await _context.Products.DeleteOneAsync(filter);

        return deleteResult.IsAcknowledged && deleteResult.DeletedCount > 0;
    }

    public async Task<IEnumerable<Product>> GetAll()
    {
        return await _context.Products.Find(p => true).ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByCategory(string catagoryName)
    {
        FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(p => p.Category, catagoryName);

        return await _context.Products.Find(filter).ToListAsync();
    }

    public async Task<Product> GetById(string id)
    {
        return await _context.Products.Find(p => p.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Product> GetByName(string name)
    {
        FilterDefinition<Product> filter = Builders<Product>.Filter.Eq(p => p.Name, name);
        return await _context.Products.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<bool> Update(Product product)
    {
        var updatedResult = await _context.Products.ReplaceOneAsync(filter: g => g.Id == product.Id, replacement: product);

        return updatedResult.IsAcknowledged && updatedResult.ModifiedCount > 0;
    }
}