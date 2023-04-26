using System.Collections.Generic;

namespace OpticaPopular.DataAccess.Repositories
{
    public interface IRepository<T, U>
    {
        public IEnumerable<U> List();
        public RequestStatus Insert(T item);
        public RequestStatus Update(T item);
        public U Find(int? id);
        public RequestStatus Delete(T item);
    }
}
