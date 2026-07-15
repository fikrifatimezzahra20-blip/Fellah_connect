# FellahConnect - Design Specification

## Project Overview

FellahConnect is a REST API platform designed to help small Moroccan farmers manage their agricultural activities. The system allows farmers to register their parcels, record harvests, monitor market prices, publish sale offers, and interact with an AI assistant capable of recommending the best selling opportunities based on real market data.

The database was designed following normalization principles to reduce data duplication, improve maintainability, and optimize query performance.

---

# Design Decisions

## 1. Why is MarketPrice a separate entity?

Market prices are dynamic and change depending on both the market and the date.

If the price were stored directly inside the Product entity, each product could only have one fixed price, which does not represent real-world agricultural markets.

Creating a separate MarketPrice entity allows the system to:

- Store historical prices.
- Compare prices across different markets.
- Track price evolution over time.
- Enable the AI assistant to recommend the best market.

---

## 2. Why does Harvest reference both Parcel and Product?

A Harvest represents a production event.

It references Parcel because every harvest comes from one specific parcel of land.

It references Product because every harvest belongs to one specific agricultural product such as tomatoes or potatoes.

This design guarantees complete traceability while avoiding duplicated information.

---

## 3. Many-to-Many Relationships

The relationship between Product and Market is conceptually Many-to-Many.

- One product can exist in many markets.
- One market contains many different products.

This relationship is implemented using the MarketPrice association table, which also stores additional information such as the price and the date.

Likewise, Harvest and Market are connected through the SaleOffer association table, allowing a harvest to be proposed in multiple markets.

---

## 4. Frequently Read Data (Indexing Strategy)

To improve application performance, the following fields should be indexed:

- All foreign keys.
- `MarketPrice.productId`
- `MarketPrice.marketId`
- `MarketPrice.priceDate`
- `Harvest.status`
- `SaleOffer.status`

A composite index on:

`(productId, marketId, priceDate)`

will optimize the AI assistant when searching for the latest market prices.

---

## 5. Data Integrity Improvements

After reviewing the initial UML model, several improvements were introduced to strengthen data integrity and maintain database consistency.

### Unique Constraints

The following attributes are defined as unique:

- `User.email` to ensure that each account is associated with a single email address.
- `Farmer.phone` to prevent duplicate farmer phone numbers.
- `Farmer.userId` to enforce a one-to-one relationship between `User` and `Farmer`, ensuring that one user can own only one farmer profile.

These constraints help eliminate duplicate records and preserve data consistency.

---

## 6. Audit Fields

To improve traceability and simplify future maintenance, every entity includes the following audit fields:

- `createdAt`
- `updatedAt`

These fields allow the system to:

- Record when each entity was created.
- Record the last time an entity was modified.
- Support future auditing, monitoring, and reporting features.

---

## 7. Date and Time Consistency

The model uses the `DateTime` data type instead of `Date` for temporal attributes.

Using `DateTime` provides more precise information by storing both the date and the exact time. This is particularly useful for:

- Recording harvest events.
- Tracking market price updates.
- Managing sale offers.
- Supporting future analytics and reporting.

---

# Conclusion

The proposed database model follows relational database best practices and supports scalability, efficient SQL joins, and future AI functionalities.

The design minimizes redundancy, improves maintainability, and satisfies the technical requirements of the FellahConnect project.

The latest improvements—including unique constraints, audit fields, and the adoption of `DateTime` for temporal data—further strengthen data integrity, traceability, and long-term maintainability while preparing the system for future development.