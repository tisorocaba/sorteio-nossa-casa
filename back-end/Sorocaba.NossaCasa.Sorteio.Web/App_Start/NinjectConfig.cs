using System;
using System.Web;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using Ninject;
using Ninject.Web.Common;
using System.Web.Http;
using Sorocaba.Commons.Ninject;
using Sorocaba.NossaCasa.Sorteio.Business.Persistence;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Sorocaba.NossaCasa.Sorteio.Web.App_Start.NinjectConfig), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(Sorocaba.NossaCasa.Sorteio.Web.App_Start.NinjectConfig), "Stop")]

namespace Sorocaba.NossaCasa.Sorteio.Web.App_Start {
    public static class NinjectConfig {

        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        public static void Start()  {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        public static void Stop() {
            bootstrapper.ShutDown();
        }
        
        private static IKernel CreateKernel() {
            IKernel kernel = new StandardKernel();
            kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
            kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();
            ConfigureBindings(kernel);

            GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);

            return kernel;
        }

        private static void ConfigureBindings(IKernel kernel) {
            kernel.Bind<Context>().ToSelf().InRequestScope();
        }
    }
}
