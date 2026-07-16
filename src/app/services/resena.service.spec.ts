import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResenaService } from './resena.service';
import { Resena, ResenaDTO } from '../models/resena';
import { environment } from '../../environments/environment';

describe('ResenaService (pruebas de integración)', () => {
  let service: ResenaService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/resenas`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResenaService],
    });

    service = TestBed.inject(ResenaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerTodos() hace GET a /api/resenas/camara/:id y devuelve la lista', () => {
    const camaraId = 1;
    const mockResenas: Resena[] = [
      {
        id: 1,
        calificacion: 5,
        comentario: 'Excelente cámara, muy nítida',
        fechaCreacion: '2026-06-01T10:00:00',
        camara: { id: 1, nombre: 'Cámara Domo 4K' },
        cliente: { id: 1, nombre: 'Johann' },
      },
    ];

    service.obtenerTodos(camaraId).subscribe((resenas) => {
      expect(resenas.length).toBe(1);
      expect(resenas).toEqual(mockResenas);
    });

    const req = httpMock.expectOne(`${apiUrl}/camara/${camaraId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResenas);
  });

  it('obtenerPorId() hace GET a /api/resenas/:id', () => {
    const mockResena: Resena = {
      id: 5,
      calificacion: 4,
      comentario: 'Buena relación calidad-precio',
      fechaCreacion: '2026-06-02T10:00:00',
      camara: { id: 1, nombre: 'Cámara Domo 4K' },
      cliente: { id: 2, nombre: 'Jennifer' },
    };

    service.obtenerPorId(5).subscribe((resena) => {
      expect(resena).toEqual(mockResena);
    });

    const req = httpMock.expectOne(`${apiUrl}/5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResena);
  });

  it('crear() hace POST a /api/resenas/camara/:id con el DTO en el body', () => {
    const camaraId = 1;
    const dto: ResenaDTO = { calificacion: 5, comentario: 'Muy recomendable' };
    const mockResponse: Resena = {
      id: 10,
      calificacion: dto.calificacion,
      comentario: dto.comentario,
      fechaCreacion: '2026-07-02T10:00:00',
      camara: { id: 1, nombre: 'Cámara Domo 4K' },
      cliente: { id: 3, nombre: 'Usuario Test' },
    };

    service.crear(camaraId, dto).subscribe((resena) => {
      expect(resena).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/camara/${camaraId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockResponse);
  });

  it('eliminar() hace DELETE a /api/resenas/:id', () => {
    service.eliminar(10).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('obtenerPromedio() hace GET a /api/resenas/camara/:id/promedio', () => {
    const camaraId = 1;

    service.obtenerPromedio(camaraId).subscribe((promedio) => {
      expect(promedio).toBe(4.5);
    });

    const req = httpMock.expectOne(`${apiUrl}/camara/${camaraId}/promedio`);
    expect(req.request.method).toBe('GET');
    req.flush(4.5);
  });

  it('propaga errores del servidor (ej. reseña duplicada) al suscriptor', () => {
    const camaraId = 1;
    const dto: ResenaDTO = { calificacion: 3, comentario: 'Repetido' };

    service.crear(camaraId, dto).subscribe({
      next: () => fail('La petición debía fallar'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(`${apiUrl}/camara/${camaraId}`);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
