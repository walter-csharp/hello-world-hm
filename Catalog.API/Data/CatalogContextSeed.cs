using Catalog.API.Entities;
using MongoDB.Driver;

namespace Catalog.API.Data;

public class CatalogContextSeed
{
    public static void SeedData(IMongoCollection<Product> productCollection)
    {
        bool existProduct = productCollection.Find(p => true).Any();
        if (!existProduct)
        {
            productCollection.InsertManyAsync(GetPreConfiguredProducts());
        }
    }

    private static IEnumerable<Product> GetPreConfiguredProducts()
    {
        return new List<Product>()
        {
            new Product()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "IPhone X",
                Price = 950.00M,
                Category = "Smart Phone"
            },
            new Product()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Samsung 10",
                Price = 600.00M,
                Category = "Smart Phone"
            },
            new Product()
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Huawei Plus",
                Price = 550.00M,
                Category = "White Appliances"
            },
        };
    }
}