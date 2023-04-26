using System.Collections.Generic;

namespace OpticaPopular.DataAccess.Repositories
{
    public interface IRepository<T>
    {
        public IEnumerable<T> List();
        public RequestStatus Insert(T item);
        public RequestStatus Update(T item);
        public T Find(int? id);
        public RequestStatus Delete(T item);
    }
}
