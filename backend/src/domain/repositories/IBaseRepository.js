class IBaseRepository {
    async findAll() {throw new Error('Method not implemented');}
    async findById(id) {throw new Error('Method not implemented');}
    async findByField(field, value) {throw new Error('Method not implemented');}
    async update(id, entity) {throw new Error('Method not implemented');}
    async save(entity) {throw new Error('Method not implemented');}
    async delete(id) {throw new Error('Method not implemented');}
    async exists(id) {throw new Error('Method not implemented');}
    async count() {throw new Error('Method not implemented');}
}
module.exports = IBaseRepository;