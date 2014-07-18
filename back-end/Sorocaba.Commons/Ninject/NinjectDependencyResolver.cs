using System;
using System.Web.Http.Dependencies;
using Ninject;
using Ninject.Syntax;
using System.Collections.Generic;

namespace Sorocaba.Commons.Ninject {
    public class NinjectDependencyResolver : NinjectDependencyScope, IDependencyResolver {

        private IKernel kernel;

        public NinjectDependencyResolver(IKernel kernel) : base(kernel) {
            this.kernel = kernel;
        }

        public IDependencyScope BeginScope() {
            return new NinjectDependencyScope(kernel.BeginBlock());
        }
    }
}
