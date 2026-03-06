const db = require('../models/index');
const hashHelper = require('../helpers/password-helper');

async function initDatabase() {
    try {
        console.log('Starting database initialization...');

        // Sync database (create tables if they don't exist)
        await db.sequelize.sync({ force: false }); // Set to true to drop all tables and recreate
        console.log('Database synced');

        // Check if admin role already exists
        let adminRole = await db.Role.findOne({ where: { name: 'admin' } });
        if (!adminRole) {
            adminRole = await db.Role.create({ name: 'admin' });
            console.log('Admin role created');
        } else {
            console.log('Admin role already exists');
        }

        // Check if admin user already exists
        let adminUser = await db.User.findOne({ 
            where: { emailAddress: 'admin@example.com' } 
        });
        
        if (!adminUser) {
            adminUser = await db.User.create({
                firstName: 'Admin',
                lastName: 'User',
                emailAddress: 'admin@example.com',
                password: hashHelper.hashPass('admin123')
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Assign admin role to admin user
        await adminUser.addRole(adminRole);
        console.log('Admin role assigned to admin user');

        // Create categories
        const categories = [
            { name: 'Afrique' },
            { name: 'Amérique du Sud' },
            { name: 'Amérique Centrale' },
            { name: 'Asie' },
        ];

        const createdCategories = [];
        for (const categoryData of categories) {
            let category = await db.Category.findOne({ where: { name: categoryData.name } });
            if (!category) {
                category = await db.Category.create(categoryData);
                console.log(`Category created: ${category.name}`);
            } else {
                console.log(`Category already exists: ${category.name}`);
            }
            createdCategories.push(category);
        }

        // Afrique=0, Amérique du Sud=1, Amérique Centrale=2, Asie=3
        const products = [
            {
                name: 'Éthiopie Yirgacheffe',
                description: 'Le berceau du café. Cultivé dans la légendaire région de Yirgacheffe, ce café naturel exprime toute la complexité aromatique de l\'Éthiopie. Notes florales de jasmin, agrumes de bergamote et finale sucrée de fruits rouges. Un voyage sensoriel unique.',
                price: 14.50,
                stock: 32,
                CategoryId: createdCategories[0].id, // Afrique
                images: [
                    { link: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800' }
                ]
            },
            {
                name: 'Kenya AA Nyeri',
                description: 'L\'acidité vibrante du Kenya. Grade AA (les plus gros grains), ce café de Nyeri explose en bouche avec des notes de cassis, pamplemousse rose et tomate confite. Une torréfaction claire préserve son caractère fruité exceptionnel.',
                price: 15.20,
                stock: 18,
                CategoryId: createdCategories[0].id, // Afrique
                images: [
                    { link: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800' }
                ]
            },
            {
                name: 'Brésil Cerrado',
                description: 'Le géant brésilien dans toute sa générosité. Ce café du Cerrado Mineiro offre un profil gourmand : noisette grillée, chocolat au lait et notes de pain d\'épices. Corps moyen, parfait pour l\'espresso du matin.',
                price: 10.90,
                stock: 67,
                CategoryId: createdCategories[1].id, // Amérique du Sud
                images: [
                    { link: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800' }
                ]
            },
            {
                name: 'Colombie Huila',
                description: 'La douceur colombienne dans toute sa splendeur. Ce café de la région de Huila offre un profil équilibré et accessible. Notes de pomme verte, sucre roux et amande douce. Une torréfaction medium révèle toute sa rondeur.',
                price: 11.90,
                stock: 52,
                CategoryId: createdCategories[1].id, // Amérique du Sud
                images: [
                    { link: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800' }
                ]
            },
            {
                name: 'Honduras Santa Bárbara',
                description: 'Découvrez ce café du massif de Santa Bárbara, l\'un des meilleurs d\'Amérique centrale. Cultivé en altitude par de petits producteurs, il révèle des notes de pêche blanche, caramel beurré et cacao. Une douceur fruitée remarquable.',
                price: 12.40,
                stock: 34,
                CategoryId: createdCategories[2].id, // Amérique Centrale
                images: [
                    { link: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800' }
                ]
            },
            {
                name: 'Mexique Chiapas',
                description: 'Un café solaire de l\'état de Chiapas, au cœur des forêts tropicales mexicaines. Cultivé à l\'ombre des arbres fruitiers par des communautés indigènes, il dévoile des notes douces de mandarine, miel sauvage et chocolat blanc.',
                price: 11.50,
                stock: 44,
                CategoryId: createdCategories[2].id, // Amérique Centrale
                images: [
                    { link: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800' }
                ]
            },
            {
                name: 'Indonésie Sumatra Mandheling',
                description: 'Un café corsé et terreux de l\'île de Sumatra. Traité selon la méthode traditionnelle Giling Basah (semi-humide), il développe un corps sirupeux exceptionnel avec des notes de cèdre, chocolat amer et épices. Idéal pour les amateurs de cafés puissants.',
                price: 13.80,
                stock: 28,
                CategoryId: createdCategories[3].id, // Asie
                images: [
                    { link: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' }
                ]
            },
            {
                name: 'Indonésie Sulawesi Toraja',
                description: 'L\'autre trésor indonésien. Venant des hauts plateaux de Toraja à Sulawesi, ce café offre un profil très différent de Sumatra : plus doux, avec un corps velouté et des notes de tabac blond, vanille et réglisse. Un café de méditation.',
                price: 14.20,
                stock: 22,
                CategoryId: createdCategories[3].id, // Asie
                images: [
                    { link: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800' }
                ]
            },
        ];

        for (const productData of products) {
            // Check if product already exists
            let product = await db.Product.findOne({ 
                where: { name: productData.name } 
            });

            if (!product) {
                // Extract images before creating product
                const { images, ...productInfo } = productData;
                
                // Create product
                product = await db.Product.create(productInfo);
                console.log(`Product created: ${product.name}`);

                // Create images for the product
                if (images && images.length > 0) {
                    for (const imageData of images) {
                        await db.Image.create({
                            ...imageData,
                            ProductId: product.id
                        });
                    }
                    console.log(`  - Added ${images.length} image(s)`);
                }
            } else {
                console.log(`Product already exists: ${product.name}`);
            }
        }

        console.log('\n✅ Database initialization completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   - Admin user: admin@example.com');
        console.log('   - Admin password: admin123');
        console.log(`   - Categories: ${createdCategories.length}`);
        console.log(`   - Products: ${products.length}`);

        // Close the database connection
        await db.sequelize.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Error initializing database:', error);
        await db.sequelize.close();
        process.exit(1);
    }
}

// Run the initialization
initDatabase();

