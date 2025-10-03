import { useState, useEffect } from 'react';
import { supabase, SurveyResponse } from '../lib/supabase';
import { BarChart3, Users, TrendingUp, MessageSquare } from 'lucide-react';

export function AdminDashboard() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      console.error('Error loading responses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Memuat data...</div>
      </div>
    );
  }

  const calculateAverage = (field: keyof SurveyResponse) => {
    if (responses.length === 0) return 0;
    const sum = responses.reduce((acc, r) => acc + (r[field] as number), 0);
    return (sum / responses.length).toFixed(2);
  };

  const countByRole = () => {
    const counts: Record<string, number> = {};
    responses.forEach(r => {
      counts[r.role] = (counts[r.role] || 0) + 1;
    });
    return counts;
  };

  const roleCounts = countByRole();

  const stats = [
    { label: 'Total Responden', value: responses.length, icon: Users, color: 'blue' },
    { label: 'Rata-rata Fasilitas', value: calculateAverage('q1_fasilitas'), icon: TrendingUp, color: 'green' },
    { label: 'Rata-rata Pelayanan', value: calculateAverage('q2_pelayanan_akademik'), icon: BarChart3, color: 'orange' },
    { label: 'Rata-rata Pengajaran', value: calculateAverage('q3_kualitas_pengajaran'), icon: TrendingUp, color: 'red' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Hasil Survei Kepuasan Civitas Akademika FISIP UI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Distribusi Responden
            </h2>
            <div className="space-y-3">
              {Object.entries(roleCounts).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{role}</span>
                  <span className="font-semibold text-gray-900">{count} responden</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Rata-rata Penilaian per Aspek
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Fasilitas</span>
                  <span className="font-semibold">{calculateAverage('q1_fasilitas')} / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(parseFloat(calculateAverage('q1_fasilitas')) / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Pelayanan Akademik</span>
                  <span className="font-semibold">{calculateAverage('q2_pelayanan_akademik')} / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(parseFloat(calculateAverage('q2_pelayanan_akademik')) / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Kualitas Pengajaran</span>
                  <span className="font-semibold">{calculateAverage('q3_kualitas_pengajaran')} / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(parseFloat(calculateAverage('q3_kualitas_pengajaran')) / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Lingkungan Kampus</span>
                  <span className="font-semibold">{calculateAverage('q4_lingkungan_kampus')} / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(parseFloat(calculateAverage('q4_lingkungan_kampus')) / 5) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Teknologi & SI</span>
                  <span className="font-semibold">{calculateAverage('q5_teknologi_informasi')} / 5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(parseFloat(calculateAverage('q5_teknologi_informasi')) / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Saran dan Masukan
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {responses
              .filter(r => r.saran && r.saran.trim() !== '')
              .map((response, index) => (
                <div key={response.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {response.role}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(response.submitted_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <p className="text-gray-700">{response.saran}</p>
                </div>
              ))}
            {responses.filter(r => r.saran && r.saran.trim() !== '').length === 0 && (
              <p className="text-gray-500 text-center py-4">Belum ada saran yang diberikan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
