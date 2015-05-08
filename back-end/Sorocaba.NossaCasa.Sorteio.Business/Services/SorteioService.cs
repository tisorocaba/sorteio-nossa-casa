using Ninject;
using Sorocaba.NossaCasa.Sorteio.Business.DataObjects;
using Sorocaba.NossaCasa.Sorteio.Business.Entities;
using Sorocaba.NossaCasa.Sorteio.Business.Exceptions;
using Sorocaba.NossaCasa.Sorteio.Business.Persistence;
using Sorocaba.NossaCasa.Sorteio.Web.Data;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;

namespace Sorocaba.NossaCasa.Sorteio.Business.Services {
    public class SorteioService {

        [Inject]
        public Context Context { get; set; }

        // Sorteio

        public SorteioE CarregarSorteio(int idSorteio) {
            SorteioE sorteio = Context.Sorteio.Find(idSorteio);
            if (sorteio == null) {
                throw new SorteioException("O sorteio especificado não pode ser encontrado.");
            }
            return sorteio;
        }

        public IQueryable<SorteioE> ListarSorteios() {
            return Context.Sorteio;
        }

        public SorteioE SalvarSorteio(SorteioE sorteio) {
            SorteioE novoSorteio = new SorteioE() {
                Data = sorteio.Data,
                Observacao = sorteio.Observacao,
                Finalizado = false,
                Empreendimentos = new List<Empreendimento>()
            };

            if (sorteio.Empreendimentos == null || sorteio.Empreendimentos.Count < 1) {
                throw new Exception("Pelo menos um empreendimento deve ser informado.");
            }

            var empreedimentos = sorteio.Empreendimentos.ToArray();
            for (int i = 0; i < empreedimentos.Length; i++) {
                novoSorteio.Empreendimentos.Add(new Empreendimento() {
                    Ordem = i + 1,
                    Nome = empreedimentos[i].Nome
                });
            }

            Context.Sorteio.Add(novoSorteio);
            Context.SaveChanges();
            return novoSorteio;
        }

        public void AtualizarSorteio(int idSorteio, SorteioE sorteio) {
            SorteioE sorteioSalvo = CarregarSorteio(idSorteio);
            VerificarSorteioRealizado(sorteioSalvo);

            sorteioSalvo.Data = sorteio.Data;
            sorteioSalvo.Observacao = sorteio.Observacao;

            foreach (var e in sorteioSalvo.Empreendimentos.ToList()) {
                Context.Empreedimento.Remove(e);
            }

            var empreedimentos = sorteio.Empreendimentos.ToArray();
            for (int i = 0; i < empreedimentos.Length; i++) {
                sorteioSalvo.Empreendimentos.Add(new Empreendimento() {
                    Ordem = i + 1,
                    Nome = empreedimentos[i].Nome
                });
            }

            Context.SaveChanges();
        }

        public void ExcluirSorteio(int idSorteio) {
            SorteioE sorteioSalvo = CarregarSorteio(idSorteio);
            VerificarSorteioRealizado(sorteioSalvo);

            var empreendimentos = sorteioSalvo.Empreendimentos.ToList();
            foreach(var empreendimento in empreendimentos) {
                Context.Empreedimento.Remove(empreendimento);
            }

            Context.Sorteio.Remove(sorteioSalvo);
            Context.SaveChanges();
        }

        public void VerificarSorteioRealizado(SorteioE sorteio) {
            if (Context.ListaSorteio.Where(ls => ls.IdSorteio == sorteio.Id && ls.Sorteada).Count() > 0) {
                throw new SorteioException("Não é possível realizar a operação. Algumas listas deste sorteio já foram sorteadas.");
            }
        }

        // CandidatoSorteio

        public IQueryable<CandidatoSorteioData> ListarCandidatosSorteio(int idSorteio) {
            SorteioE sorteio = CarregarSorteio(idSorteio);
            return
                from candidato in Context.CandidatoSorteio
                join cLista in Context.CandidatoListaSorteio on candidato equals cLista.CandidatoSorteio into left
                from cLista in left.Where(l => l.SequenciaContemplacao != null).DefaultIfEmpty(null)
                where candidato.IdSorteio == sorteio.Id
                orderby candidato.Nome, candidato.Cpf
                select new CandidatoSorteioData {
                    Cpf = candidato.Cpf,
                    Nome = candidato.Nome,
                    QuantidadeCriterios = candidato.QuantidadeCriterios,
                    Contemplado = candidato.Contemplado,
                    Lista = cLista.ListaSorteio.Nome,
                    Ordem = cLista.SequenciaContemplacao,
                    Data = cLista.DataContemplacao
                };
        }

        // ListaSorteio

        public IQueryable<CandidatoListaSorteioData> ProjetarCandidatosListaSorteio(IQueryable<CandidatoListaSorteio> dados) {
            return dados.Select(d => new CandidatoListaSorteioData() {
                Id = d.CandidatoSorteio.Id,
                Cpf = d.CandidatoSorteio.Cpf,
                Nome = d.CandidatoSorteio.Nome,
                QuantidadeCriterios = d.CandidatoSorteio.QuantidadeCriterios,
                Contemplado = d.CandidatoSorteio.Contemplado,
                Sequencia = d.Sequencia,
                Classificacao = d.Classificacao,
                SequenciaContemplacao = d.SequenciaContemplacao,
                DataContemplacao = d.DataContemplacao
            });
        }

        public ListaSorteio CarregarListaSorteio(int idListaSorteio) {
            ListaSorteio listaSorteio = Context.ListaSorteio.Find(idListaSorteio);
            if (listaSorteio == null) {
                throw new SorteioException("A lista de sorteio especificada não pode ser encontrada.");
            }
            return listaSorteio;
        }

        public IQueryable<ListaSorteio> ListarListasSorteio(int idSorteio) {
            SorteioE sorteio = CarregarSorteio(idSorteio);
            return Context.ListaSorteio.Where(ls => ls.IdSorteio == sorteio.Id);
        }

        public IQueryable<CandidatoListaSorteio> ListarCandidatosListaSorteio(int idListaSorteio) {
            ListaSorteio listaSorteio = CarregarListaSorteio(idListaSorteio);
            return Context.CandidatoListaSorteio
                .Include(cls => cls.CandidatoSorteio)
                .Where(cls => cls.IdListaSorteio == listaSorteio.Id)
                .OrderBy(cls => cls.SequenciaContemplacao == null)
                .ThenBy(cls => cls.SequenciaContemplacao)
                .ThenBy(cls => cls.CandidatoSorteio.Nome);
        }

        public IQueryable<CandidatoListaSorteio> ListarCandidatosContempladosListaSorteio(int idListaSorteio) {
            return ListarCandidatosListaSorteio(idListaSorteio)
                .Where(cls => cls.SequenciaContemplacao != null);
        }

        public void AlterarQuantidadesListasSorteio(int idSorteio, IEnumerable<ListaSorteio> listasSorteio) {

            SorteioE sorteio = CarregarSorteio(idSorteio);
            VerificarSorteioRealizado(sorteio);

            if (listasSorteio.Count() < 1) {
                throw new SorteioException("Pelo menos uma lista deve ser indicada.");
            }

            foreach (var listaSorteio in listasSorteio) {
                ListaSorteio listaSalva = CarregarListaSorteio(listaSorteio.Id);
                if (listaSalva.IdSorteio != sorteio.Id) {
                    throw new SorteioException("A lista especificada não pertence ao sorteio especificado.");
                }
                if (listaSorteio.Quantidade < 1) {
                    throw new SorteioException("A quantidade das listas deve ser maior que zero.");
                }
                listaSalva.Quantidade = listaSorteio.Quantidade;
            }

            Context.SaveChanges();
        }
    }
}
