import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Star, Send, CheckCircle } from 'lucide-react';

export function SurveyForm() {
  const { profile } = useAuth();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [ratings, setRatings] = useState({
    q1_fasilitas: 0,
    q2_pelayanan_akademik: 0,
    q3_kualitas_pengajaran: 0,
    q4_lingkungan_kampus: 0,
    q5_teknologi_informasi: 0,
  });
  const [saran, setSaran] = useState('');

  useEffect(() => {
    checkExistingResponse();
  }, [profile]);

  const checkExistingResponse = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('id')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      setHasSubmitted(!!data);
    } catch (err) {
      console.error('Error checking response:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const allRated = Object.values(ratings).every(rating => rating > 0);
    if (!allRated) {
      setError('Mohon berikan rating untuk semua aspek');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          user_id: profile!.id,
          role: profile!.role,
          ...ratings,
          saran,
        });

      if (error) throw error;
      setHasSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan survei');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Memuat...</div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Terima Kasih!
          </h2>
          <p className="text-gray-600">
            Survei Anda telah berhasil dikirim. Kami menghargai partisipasi Anda dalam meningkatkan kualitas FISIP UI.
          </p>
        </div>
      </div>
    );
  }

  const questions = [
    { key: 'q1_fasilitas', label: 'Fasilitas Kampus' },
    { key: 'q2_pelayanan_akademik', label: 'Pelayanan Akademik' },
    { key: 'q3_kualitas_pengajaran', label: 'Kualitas Pengajaran' },
    { key: 'q4_lingkungan_kampus', label: 'Lingkungan Kampus' },
    { key: 'q5_teknologi_informasi', label: 'Teknologi & Sistem Informasi' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Survei Kepuasan Civitas Akademika
            </h1>
            <p className="text-gray-600">
              FISIP Universitas Indonesia
            </p>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-medium">Nama:</span> {profile?.full_name}
              </p>
              <p className="text-sm text-blue-900">
                <span className="font-medium">Role:</span> {profile?.role.toUpperCase()}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <p className="text-sm text-gray-600 mb-4">
                Berikan penilaian Anda untuk setiap aspek (1 = Sangat Tidak Puas, 5 = Sangat Puas)
              </p>

              {questions.map((question) => (
                <div key={question.key} className="border-b border-gray-200 pb-6">
                  <label className="block text-base font-medium text-gray-900 mb-3">
                    {question.label}
                  </label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatings({ ...ratings, [question.key]: star })}
                        className="group relative"
                      >
                        <Star
                          className={`w-10 h-10 transition-all ${
                            star <= ratings[question.key as keyof typeof ratings]
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300 hover:text-yellow-200'
                          }`}
                        />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {star}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                Saran dan Masukan (Opsional)
              </label>
              <textarea
                value={saran}
                onChange={(e) => setSaran(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tuliskan saran atau masukan Anda untuk meningkatkan kualitas FISIP UI..."
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {submitting ? 'Mengirim...' : 'Kirim Survei'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
